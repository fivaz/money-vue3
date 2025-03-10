import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Navbar from '../navbar/navbar.vue'

describe('Login', () => {
  it('renders properly', () => {
    const wrapper = mount(Navbar, { props: { msg: 'Sing in' } })
    expect(wrapper.text()).toContain('Sign in')
  })
})
