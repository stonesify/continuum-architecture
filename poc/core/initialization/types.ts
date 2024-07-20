export interface ServicePovider {
  onInit?: () => never
  beforeHandle?: () => never
  onTerminate?: () => never
  register?: () => never
  boot?: () => never
}