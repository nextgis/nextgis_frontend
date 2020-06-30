import { ResourceGroup, NgwResource } from '../../../packages/ngw-orm/src';

@NgwResource({
  type: 'resource_group',
  display_name: 'ngw-orm-tests',
  description:
    'Automatically created resource group when running tests for @nextgis/ngw-orm',
})
export class SandboxGroup extends ResourceGroup {}
