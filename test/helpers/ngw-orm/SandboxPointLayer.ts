import { PointLayer, NgwResource, Column } from '../../../packages/ngw-orm/src';

@NgwResource({
  type: 'vector_layer',
  display_name: 'ngw-orm-point-layer-tests',
})
export class SandboxPointLayer extends PointLayer {
  @Column()
  test!: string;
  @Column()
  number!: number;
}
