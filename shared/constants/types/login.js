// @flow
import * as I from 'immutable'
import * as DeviceTypes from './devices'
import HiddenString from '../../util/hidden-string'

export type Mode =
  | 'codePageModeScanCode'
  | 'codePageModeShowCode'
  | 'codePageModeEnterText'
  | 'codePageModeShowText'

export type DeviceRole =
  | 'codePageDeviceRoleExistingPhone'
  | 'codePageDeviceRoleNewPhone'
  | 'codePageDeviceRoleExistingComputer'
  | 'codePageDeviceRoleNewComputer'

// It's the b64 encoded value used to render the image
export type QRCode = HiddenString

export type _Account = {
  hasStoredSecret: boolean,
  username: string,
}
export type Account = I.RecordOf<_Account>

export type _Device = {|
  id: DeviceTypes.DeviceID,
  name: string,
  type: DeviceTypes.DeviceType,
|}
export type Device = I.RecordOf<_Device>

export type _State = {
  codePageOtherDeviceName: string,
  codePageOtherDeviceType: 'phone' | 'desktop' | 'paperkey',
  codePageTextCode: HiddenString,
  codePageTextCodeError: string,
  configuredAccounts: I.List<Account>,
  devicenameError: string,
  forgotPasswordError: ?Error,
  forgotPasswordSubmitting: boolean,
  forgotPasswordSuccess: boolean,
  justDeletedSelf: ?string,
  justRevokedSelf: ?string,
  loginError: string,
  provisionUsernameOrEmail: string,
  provisionDevices: I.List<Device>,
  provisionDevicesCanSelectNoDevice: boolean,
  provisionSelectedDevice: ?Device,
  registerUserPassError: ?string,
  registerUserPassLoading: boolean,
}

export type State = I.RecordOf<_State>
