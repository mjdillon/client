'use strict'

import TabBar from './native/tab-bar'
import { connect } from 'react-redux/native'
import MetaNavigator from './router/meta-navigator'
import globalRoutes from './router/global-routes'

import Folders from './tabs/folders'
import Chat from './tabs/chat'
import People from './tabs/people'
import Devices from './tabs/devices'
import NoTab from './tabs/no-tab'
import More from './tabs/more'

import React, { Component, Text, View, StyleSheet, BackAndroid, DrawerLayoutAndroid, Image, TouchableNativeFeedback } from 'react-native'

import { FOLDER_TAB, CHAT_TAB, PEOPLE_TAB, DEVICES_TAB, MORE_TAB, STARTUP_TAB, prettify } from './constants/tabs'
import { androidTabBarHeight } from './styles/native'

import { switchTab } from './actions/tabbed-router'
import { navigateBack } from './actions/router'
import { startup } from './actions/config'

import * as Constants from './constants/config'

// TODO when kex2 is done import Registration from './login2/register'
import Welcome from './login2/welcome'

const tabToRootComponent = {
  [FOLDER_TAB]: Folders,
  [CHAT_TAB]: Chat,
  [PEOPLE_TAB]: People,
  [DEVICES_TAB]: Devices,
  [MORE_TAB]: More
}

class AndroidNavigator extends Component {
  constructor (props) {
    super(props)
  }

  push (componentAtTop) {
    return false
  }

  getCurrentRoutes () {
    return []
  }

  popToRoute (targetRoute) {
    return false
  }

  immediatelyResetRouteStack () {
    return false
  }

  render () {
    let componentAtTop = this.props.initialRouteStack[this.props.initialRouteStack.length - 1]
    return this.props.renderScene(componentAtTop, null)
  }
}

AndroidNavigator.propTypes = {
  initialRouteStack: React.PropTypes.array.isRequired,
  renderScene: React.PropTypes.func.isRequired
}

export default class Nav extends Component {
  constructor (props) {
    super(props)
    this.props.dispatch(startup())
  }

  _renderContent (activeTab, rootComponent) {
    return (
      <View style={styles.tabContent} collapsable={false}>
        {React.createElement(
          connect(state => state.tabbedRouter.getIn(['tabs', activeTab]).toObject())(MetaNavigator), {
            store: this.props.store,
            rootComponent: rootComponent || tabToRootComponent[activeTab] || NoTab,
            globalRoutes,
            navBarHeight: 0,
            Navigator: AndroidNavigator,
            NavBar: <View/>
          }
        )}
      </View>
    )
  }

  componentWillMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      // TODO Properly handle android back button press
      const currentRoute = this.props.tabbedRouter.getIn(['tabs', this.props.tabbedRouter.get('activeTab'), 'uri'])
      const {dispatch} = this.props
      if (currentRoute == null || currentRoute.count() <= 1) {
        return false
      }
      dispatch(navigateBack())
      return true
    })
  }

  render () {
    const {dispatch} = this.props
    const activeTab = this.props.tabbedRouter.get('activeTab')

    if (this.props.config.navState === Constants.navStartingUp) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if (this.props.config.navState === Constants.navNeedsRegistration) {
      // TODO when kex2 is done return this._renderContent(STARTUP_TAB, Registration)
    }

    if (this.props.config.navState === Constants.navNeedsLogin) {
      return this._renderContent(STARTUP_TAB, Welcome)
    }

    const drawerContnet = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
      </View>
    )

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref='drawer'
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => drawerContnet}>
        <View collapsable={false} style={{flex: 1}}>
            <View
              title={''}
              style={styles.toolbar}>
              <View collapsable={false} style={styles.toolbarContent}>
                <View style={{flex: 0}}>
                <TouchableNativeFeedback
                  onPress={ () => this.refs.drawer && this.refs.drawer.openDrawer() }
                  delayPressIn={0}
                  background={TouchableNativeFeedback.Ripple('grey', true)} >
                  <View>
                    <Image style={[styles.toolbarImage, {marginTop: 4}]} resizeMode={'contain'} source={require('image!ic_menu_black_24dp')}/>
                  </View>
                </TouchableNativeFeedback>
              </View>

                <View style={{marginLeft: 40}}>
                  <Text style={styles.toolbarName}>{prettify(activeTab)}</Text>
                </View>

                <View style={styles.toolbarSearchWrapper}>
                  <TouchableNativeFeedback
                    onPress={ () => console.log('todo: show search')}
                    delayPressIn={0}
                    background={TouchableNativeFeedback.Ripple('grey', true)} >
                    <View>
                      <Image style={styles.toolbarImage} resizeMode={'contain'} source={require('image!ic_search_black_24dp')}/>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </View>
          <View collapsable={false} style={{flex: 2}}>
            <TabBar style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
                <TabBar.Item
                  title='Folders'
                  selected={activeTab === FOLDER_TAB}
                  onPress={() => dispatch(switchTab(FOLDER_TAB))}>
                  {this._renderContent(FOLDER_TAB)}
                </TabBar.Item>
                <TabBar.Item
                  title='Chat'
                  selected={activeTab === CHAT_TAB}
                  onPress={() => dispatch(switchTab(CHAT_TAB))}>
                  {this._renderContent(CHAT_TAB)}
                </TabBar.Item>
                <TabBar.Item
                  title='People'
                  systemIcon='contacts'
                  selected={activeTab === PEOPLE_TAB}
                  onPress={() => dispatch(switchTab(PEOPLE_TAB))}>
                  {this._renderContent(PEOPLE_TAB)}
                </TabBar.Item>
                <TabBar.Item
                  title='Devices'
                  selected={activeTab === DEVICES_TAB}
                  onPress={() => dispatch(switchTab(DEVICES_TAB))}>
                  {this._renderContent(DEVICES_TAB)}
                </TabBar.Item>
                <TabBar.Item
                  title='more'
                  selected={activeTab === MORE_TAB}
                  onPress={() => dispatch(switchTab(MORE_TAB))}>
                  {this._renderContent(MORE_TAB)}
                </TabBar.Item>
            </TabBar>
          </View>
        </View>
      </DrawerLayoutAndroid>

    )
  }
}

Nav.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  tabbedRouter: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired,
  config: React.PropTypes.shape({
    navState: React.PropTypes.oneOf([Constants.navStartingUp, Constants.navNeedsRegistration, Constants.navNeedsLogin, Constants.navLoggedIn])
  }).isRequired
}

const styles = StyleSheet.create({
  tabContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: androidTabBarHeight
  },
  toolbar: {
    height: 50,
    flex: 0
  },

  toolbarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10
  },

  toolbarName: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black'
  },

  toolbarImage: {
    height: 40,
    width: 30
  },

  toolbarSearchWrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})
