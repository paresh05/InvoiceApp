import { shallowMount } from '@vue/test-utils'
import { createStore } from 'vuex'
import InvoiceModal from '@/components/InvoiceModal'

/**
 * This is the test file for Invoice modal Component
 */

describe('Home.vue', () => {
  let mockedToggleModal;
  let mockedToggleInvFn;
  let mockedToggleEditInvFn;
  let store;
  beforeEach(()=> {
    mockedToggleModal = jest.fn();
    mockedToggleInvFn = jest.fn();
    mockedToggleEditInvFn = jest.fn();
    store = createStore({
      state: {currentInvoiceArray: [],darkMode: true, editInvoice: false},
      mutations: {
        TOGGLE_MODAL: mockedToggleModal,
        TOGGLE_INVOICE: mockedToggleInvFn,
        TOGGLE_EDIT_INVOICE: mockedToggleEditInvFn
      }
    })
  })
  it('renders heading', () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    expect(wrapper.text()).toContain('New Invoice')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#billerStreetAddress')
    await input.setValue('Surathkal')
    expect(input.element.value).toBe('Surathkal')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#billerCity')
    await input.setValue('Mangalore')
    expect(input.element.value).toBe('Mangalore')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#billerCountry')
    await input.setValue('India')
    expect(input.element.value).toBe('India')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input1 = wrapper.find('#billerStreetAddress')
    await input1.setValue('Surathkal')
    const button = wrapper.find('#BillTo')
    const input = wrapper.find('#clientStreetAddress')
    await button.trigger('click')
    expect(input.element.value).toBe('Surathkal')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#clientName')
    await input.setValue('Paresh')
    expect(input.element.value).toBe('Paresh')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#clientStreetAddress')
    await input.setValue('Indiranagar')
    expect(input.element.value).toBe('Indiranagar')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#clientCity')
    await input.setValue('Bangalore')
    expect(input.element.value).toBe('Bangalore')
  })
  it('renders input field',async () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#clientCountry')
    await input.setValue('India')
    expect(input.element.value).toBe('India')
  })
  it('renders input field', () => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#invoiceDate')
    expect(input.element.value).toBe('Jun 23, 2022')
  })
  it('renders input field', async() => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#paymentDueDate')
    await wrapper.find('#paymentTerms').setValue('60')
    expect(input.element.value).toBe('Aug 22, 2022')
  })
  it('renders input field', async() => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#productDescription')
    await input.setValue('Electronics')
    expect(input.element.value).toBe('Electronics')
  })
  it('renders input field', async() => {
    const wrapper = shallowMount(InvoiceModal,{
        global: { plugins: [store] }
    })
    const input = wrapper.find('#addNewItem')
    await input.trigger('click')
    const inputQty = wrapper.find('#qty')
    await inputQty.setValue('1')
    expect(inputQty.element.value).toBe('1')
  })
})
