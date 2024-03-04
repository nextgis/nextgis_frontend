import { Column, NgwResource, PointLayer } from '../../../packages/ngw-orm/src';

export interface ISandboxPointLayer {
  test: string | null;
  number: number | null;
}

@NgwResource({
  type: 'vector_layer',
  display_name: 'ngw-orm-point-layer-tests',
})
export class SandboxPointLayer
  extends PointLayer
  implements ISandboxPointLayer
{
  @Column()
  test!: string;
  @Column()
  number!: number;
}
