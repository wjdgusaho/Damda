import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    colorTheme?: string
    color50?: string
    color100?: string
    color200?: string
    color300?: string
    color400?: string
    color500?: string
    color600?: string
    color700?: string
    color800?: string
    color900?: string
    colorEtc?: string
    colorCommon?: string
    colorShadow?: string
  }
}
