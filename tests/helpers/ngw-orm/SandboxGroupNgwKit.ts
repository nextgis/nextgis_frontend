import { ResourceGroup, NgwResource } from '../../../packages/ngw-orm/src';

@NgwResource({
  type: 'resource_group',
  display_name: 'ngw-kit-tests',
  description:
    'Automatically created resource group when running tests for @nextgis/ngw-kit',
})
export class SandboxGroupNgwKit extends ResourceGroup {}
