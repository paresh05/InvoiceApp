import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Home from '@/views/Home'

/**
 * This is the test file for Home View
 */

describe('Home.vue', () => {
  let mockedToggleInvFn;
  let mockedToggleModeFn;
  let store;
  beforeEach(()=> {
    mockedToggleInvFn = jest.fn();
    mockedToggleModeFn = jest.fn();
    store = createStore({
      state: {invoiceData: [],darkMode: true},
      mutations: {TOGGLE_INVOICE:mockedToggleInvFn, TOGGLE_MODE:mockedToggleModeFn}
    })
  })
  it('renders heading', () => {
    const wrapper = shallowMount(Home,{
        global: { plugins: [store] }
    })
    const heading = wrapper.find('#heading')
    expect(heading.text()).toMatch("Invoices")
  })
  it('renders subheading', () => {
    const wrapper = shallowMount(Home,{
        global: { plugins: [store] }
    })
    const heading = wrapper.find('#subheading')
    expect(heading.text()).toMatch("There are 0 total invoices")
  })
  test ('calls mockedToggleInvoice mutation function', async ()=> {
    const wrapper = shallowMount(Home,{
        global: { plugins: [store] }
    })
    const button = wrapper.find('#invoiceButton')
    await button.trigger('click')
    expect(mockedToggleInvFn).toHaveBeenCalled()
  })
  test ('calls mockedToggleMode mutation function', async ()=> {
    const wrapper = shallowMount(Home,{
        global: { plugins: [store] }
    })
    const button = wrapper.find('#darkModeButton')
    await button.trigger('click')
    expect(mockedToggleModeFn).toHaveBeenCalled()
  })
})
