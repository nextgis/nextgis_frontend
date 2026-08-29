import { getElement } from '@nextgis/dom';

import { getControlOptions } from './controlOptions';

import type {
  AddControlOptions,
  ControlContainerOptions,
  ControlPosition,
  ControlTargetPosition,
  CreateControlOptions,
  MapControl,
  ToggleControl,
} from './interfaces';

import './ControlContainer.css';

type SwitchToggleControl = Pick<
  ToggleControl,
  'onClick' | 'getStatus' | 'onStatusChange' | 'switch' | 'disableOnSecondClick'
>;

interface SwitchBinding {
  group: Set<SwitchToggleControl>;
  control: SwitchToggleControl;
  hadDisableOnSecondClick: boolean;
  previousDisableOnSecondClick?: boolean;
  unsubscribe: () => void;
}

export class ControlContainer {
  private readonly classPrefix: string = 'webmap';
  private readonly addClass?: string;
  private readonly map?: unknown;
  private readonly wrapperClass?: string;
  private readonly ownsContainer: boolean;
  private _container: HTMLElement;
  private _positionsContainers: {
    [key in ControlPosition]: HTMLElement;
  };
  private _targets: Set<HTMLElement> = new Set();
  private _idContainers: Map<string, HTMLElement> = new Map();
  private _pendingChildren: Map<
    string,
    { element: HTMLElement; order: number; control?: object }[]
  > = new Map();
  private _orders: WeakMap<HTMLElement, number> = new WeakMap();
  private _targetOptions: WeakMap<HTMLElement, CreateControlOptions> =
    new WeakMap();
  private _switchGroups: WeakMap<
    HTMLElement,
    Map<string, Set<SwitchToggleControl>>
  > = new WeakMap();
  private _switchBindings: WeakMap<HTMLElement, SwitchBinding> = new WeakMap();

  constructor(opt: ControlContainerOptions = {}) {
    this.classPrefix = opt.classPrefix || this.classPrefix;
    this.addClass = opt.addClass;
    this.map = opt.map;
    this.wrapperClass = opt.wrapperClass;
    const externalPositions: ControlPosition[] = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ];
    const positionContainers = externalPositions.some(
      (position) => !!opt.positionContainers?.[position],
    )
      ? opt.positionContainers
      : undefined;
    this.ownsContainer = !opt.container && !positionContainers;
    const { element, positionsContainers } = this.createContainerElement(
      opt.container,
      positionContainers,
    );
    this._container = element;
    this._positionsContainers = positionsContainers;
  }

  addTo(el: HTMLElement | string): this {
    if (!this.ownsContainer) {
      return this;
    }
    const el_ = getElement(el);
    if (el_) {
      el_.appendChild(this._container);
    }
    return this;
  }

  detach(): void {
    if (!this.ownsContainer) {
      Array.from(this._targets).forEach((target) => this.removeTarget(target));
      this._pendingChildren.clear();
      return;
    }
    const parent = this._container.parentElement;
    if (parent) {
      parent.removeChild(this._container);
    }
  }

  getContainer(): HTMLElement {
    return this._container;
  }

  getPositionContainer(position: ControlPosition): HTMLElement | undefined {
    return this._positionsContainers[position];
  }

  newPositionContainer(
    position: ControlTargetPosition,
    order = 0,
    control?: object,
  ): HTMLElement | undefined {
    const newContainer = document.createElement('div');
    newContainer.className =
      `${this.classPrefix}-ctrl-wrapper` +
      (this.wrapperClass ? ' ' + this.wrapperClass : '');
    if (getControlOptions(control)?.margin) {
      newContainer.classList.add(`${this.classPrefix}-ctrl-margin`);
    }
    this.append(newContainer, position, order, control);
    return newContainer;
  }

  addControl(
    control: MapControl,
    position: ControlTargetPosition,
    options: AddControlOptions = {},
  ): HTMLElement | undefined {
    const controlContainer = control.onAdd(this.map);
    if (controlContainer instanceof HTMLElement) {
      const target = this.newPositionContainer(
        position,
        options.order,
        control,
      );
      if (target) {
        target.appendChild(controlContainer);
        if (options.id) {
          this.registerIDContainer(options.id, controlContainer, control);
        }
        return target;
      }
    }
  }

  append(
    element: HTMLElement | string,
    position: ControlTargetPosition,
    order = 0,
    control?: object,
  ): HTMLElement | undefined {
    const node = this._normalizeElement(element);
    if (!node) return;

    const positionContainer = this._resolveTargetContainer(position);
    if (positionContainer) {
      this._insertSorted(positionContainer, node, order);
      this._registerSwitchControl(node, control, positionContainer);
      return positionContainer;
    } else if (typeof position !== 'string') {
      this._appendPending(position.inside, node, order, control);
    }
  }

  registerIDContainer(
    id: string,
    controlRoot: HTMLElement,
    control?: object,
  ): void {
    this._idContainers.set(id, controlRoot);
    this._registerTargetOptions(controlRoot, control);
    this._flushPending(id, controlRoot);
  }

  unregisterIDContainer(id: string): void {
    const controlRoot = this._idContainers.get(id);
    if (controlRoot) {
      this._targetOptions.delete(controlRoot);
    }
    this._idContainers.delete(id);
    this._pendingChildren.delete(id);
  }

  removeTarget(target: HTMLElement): void {
    const parent = target.parentElement;
    if (parent) {
      parent.removeChild(target);
    }
    this._unregisterSwitchControl(target);
    this._removePending(target);
    this._targets.delete(target);
  }

  private createContainerElement(
    container?: HTMLElement,
    positionContainers?: Partial<Record<ControlPosition, HTMLElement>>,
  ): {
    element: HTMLElement;
    positionsContainers: { [key in ControlPosition]: HTMLElement };
  } {
    const element = container || document.createElement('div');
    if (!container) {
      element.className =
        `${this.classPrefix}-control-container` +
        (this.addClass ? ' ' + this.addClass : '');
    }

    const positionsContainers = {} as { [key in ControlPosition]: HTMLElement };
    const positions: ControlPosition[] = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ];
    positions.forEach((x) => {
      const positionContainer =
        positionContainers?.[x] || this._createPositionContainer(x);
      positionsContainers[x] = positionContainer;
      if (!positionContainers?.[x]) {
        element.appendChild(positionContainer);
      }
    });

    return { element, positionsContainers };
  }

  private _createPositionContainer(position: ControlPosition): HTMLElement {
    const positionContainer = document.createElement('div');
    positionContainer.className = `${this.classPrefix}-ctrl-${position}`;
    return positionContainer;
  }

  private _resolveTargetContainer(
    position: ControlTargetPosition,
  ): HTMLElement | undefined {
    return typeof position === 'string'
      ? this._positionsContainers[position]
      : this._idContainers.get(position.inside);
  }

  private _normalizeElement(element: HTMLElement | string) {
    if (typeof element !== 'string') {
      return element;
    }

    const template = document.createElement('template');
    template.innerHTML = element.trim();
    return template.content.firstElementChild as HTMLElement | null;
  }

  private _insertSorted(
    positionContainer: HTMLElement,
    element: HTMLElement,
    order: number,
  ): void {
    this._orders.set(element, order);
    element.style.order = String(order);

    const isBottomPosition = this._isBottomPositionContainer(positionContainer);
    const children = Array.from(positionContainer.children) as HTMLElement[];
    const before = children.find((child) => {
      if (child === element) {
        return false;
      }
      const value = this._orders.get(child) ?? Number.POSITIVE_INFINITY;
      return isBottomPosition ? value <= order : value > order;
    });

    if (before) {
      positionContainer.insertBefore(element, before);
    } else if (element.parentElement === positionContainer) {
      return;
    } else {
      positionContainer.appendChild(element);
    }
    this._targets.add(element);
  }

  private _isBottomPositionContainer(element: HTMLElement): boolean {
    return (
      element === this._positionsContainers['bottom-left'] ||
      element === this._positionsContainers['bottom-right']
    );
  }

  private _appendPending(
    parentId: string,
    element: HTMLElement,
    order: number,
    control?: object,
  ): void {
    const parent = element.parentElement;
    if (parent) {
      parent.removeChild(element);
    }
    const pending = this._pendingChildren.get(parentId) || [];
    pending.push({ element, order, control });
    pending.sort((a, b) => a.order - b.order);
    this._pendingChildren.set(parentId, pending);
    this._targets.add(element);
  }

  private _flushPending(parentId: string, target: HTMLElement): void {
    const pending = this._pendingChildren.get(parentId);
    if (!pending) return;

    for (const { element, order, control } of pending) {
      this._insertSorted(target, element, order);
      this._registerSwitchControl(element, control, target);
    }
    this._pendingChildren.delete(parentId);
  }

  private _removePending(target: HTMLElement): void {
    this._pendingChildren.forEach((children, parentId) => {
      const filtered = children.filter(({ element }) => element !== target);
      if (filtered.length) {
        this._pendingChildren.set(parentId, filtered);
      } else {
        this._pendingChildren.delete(parentId);
      }
    });
  }

  private _registerSwitchControl(
    element: HTMLElement,
    control: object | undefined,
    target: HTMLElement,
  ): void {
    if (!this._isSwitchToggleControl(control)) return;
    this._unregisterSwitchControl(element);

    const groupName =
      typeof control.switch === 'string' ? control.switch : 'default';
    const group = this._getSwitchGroup(target, groupName);
    const hadDisableOnSecondClick = Object.prototype.hasOwnProperty.call(
      control,
      'disableOnSecondClick',
    );
    const previousDisableOnSecondClick = control.disableOnSecondClick;
    const targetDisableOnSecondClick =
      control.disableOnSecondClick === undefined
        ? this._getTargetDisableOnSecondClick(target)
        : undefined;

    if (targetDisableOnSecondClick !== undefined) {
      control.disableOnSecondClick = targetDisableOnSecondClick;
    }

    group.add(control);

    const unsubscribe = control.onStatusChange((status) => {
      if (status) {
        this._disableSwitchSiblings(control, group);
      }
    });
    this._switchBindings.set(element, {
      control,
      group,
      unsubscribe,
      hadDisableOnSecondClick,
      previousDisableOnSecondClick,
    });

    if (control.getStatus()) {
      this._disableSwitchSiblings(control, group);
    }
  }

  private _unregisterSwitchControl(element: HTMLElement): void {
    const binding = this._switchBindings.get(element);
    if (binding) {
      binding.unsubscribe();
      binding.group.delete(binding.control);
      if (binding.hadDisableOnSecondClick) {
        binding.control.disableOnSecondClick =
          binding.previousDisableOnSecondClick;
      } else {
        delete binding.control.disableOnSecondClick;
      }
      this._switchBindings.delete(element);
    }

    Array.from(element.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        this._unregisterSwitchControl(child);
      }
    });
  }

  private _getSwitchGroup(
    target: HTMLElement,
    groupName: string,
  ): Set<SwitchToggleControl> {
    let targetGroups = this._switchGroups.get(target);
    if (!targetGroups) {
      targetGroups = new Map();
      this._switchGroups.set(target, targetGroups);
    }
    let group = targetGroups.get(groupName);
    if (!group) {
      group = new Set();
      targetGroups.set(groupName, group);
    }
    return group;
  }

  private _disableSwitchSiblings(
    activeControl: SwitchToggleControl,
    group: Set<SwitchToggleControl>,
  ): void {
    group.forEach((control) => {
      if (control !== activeControl && control.getStatus()) {
        control.onClick(false);
      }
    });
  }

  private _getTargetDisableOnSecondClick(
    target: HTMLElement,
  ): boolean | undefined {
    return this._targetOptions.get(target)?.disableOnSecondClick;
  }

  private _isSwitchToggleControl(
    control: object | undefined,
  ): control is SwitchToggleControl {
    const toggle = control as
      | {
          switch?: unknown;
          onStatusChange?: unknown;
          getStatus?: unknown;
          onClick?: unknown;
        }
      | undefined;
    return !!(
      toggle?.switch &&
      typeof toggle.onStatusChange === 'function' &&
      typeof toggle.getStatus === 'function' &&
      typeof toggle.onClick === 'function'
    );
  }

  private _registerTargetOptions(target: HTMLElement, control?: object): void {
    const options = getControlOptions(control) || getControlOptions(target);
    if (options) {
      this._targetOptions.set(target, options);
    } else {
      this._targetOptions.delete(target);
    }
  }
}
