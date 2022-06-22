import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import InvoiceView from '@/views/InvoiceView'

describe('InvoiceView.vue', () => {
  let mockedCurrentInvFn;
  let mockedToggleInvFn;
  let mockedToggleEditInvFn;
  let store;
  let mockRoute
  let mockRouter
  let wrapper
  let invoiceArray = [
    {
        billerCity: "Udupi",
        billerCountry: "India",
        billerStreetAddress: "Bangalore",
        billerZipCode: "576001",
        clientCity: "Surathkal",
        clientCountry: "India",
        clientEmail: "praveen@gmail.com",
        clientName: "Praveen",
        clientStreetAddress: "Iddya",
        clientZipCode: "575014",
        docId: "TU6ltXncBCASOfXEklZt",
        invoiceDate: "Jun 9, 2022",
        invoiceDateUnix: 1654747525640,
        invoiceDraft: false,
        invoiceId: "ace5fc",
        invoiceItemList:[{
          id: "4ace5fc3449",
          itemName: "LED TV",
          price: "55000",
          qty: "1",
          total: 55000
        },
        {
          id: "ce5fc3449cc",
          itemName: "AC",
          price: "25500",
          qty: "2",
          total: 51000,
        }],
        invoicePaid: false,
        invoicePending: true,
        invoiceTotal: 106000,
        paymentDueDate: "Aug 8, 2022",
        paymentDueDateUnix: 1659931594452,
        paymentTerms: "60",
        productDescription: "Electronics"
    }
  ]
  beforeEach(()=> {
    mockedCurrentInvFn = jest.fn();
    mockedToggleInvFn = jest.fn();
    mockedToggleEditInvFn = jest.fn();
    store = createStore({
      state: {currentInvoiceArray: invoiceArray,editInvoice: false, darkMode: true},
      mutations: {
        SET_CURRENT_INVOICE: mockedCurrentInvFn,
        TOGGLE_INVOICE:mockedToggleInvFn,
        TOGGLE_EDIT_INVOICE:mockedToggleEditInvFn
      }
    })
    mockRoute = {
      params: {
        invoiceId: 'ACE5FC'
      }
    }
    mockRouter = {
      push: jest.fn()
    }
    wrapper = mount(InvoiceView,{
      global: {
          mocks: {
              $route: mockRoute,
              $router: mockRouter
          },
          plugins: [store]
        }
    })
  })
  test ('calls mockedToggleMode mutation function', async ()=> {
    expect(mockedCurrentInvFn).toHaveBeenCalled()
    expect(wrapper.find('#exist').exists()).toBe(true)
    const button = wrapper.find('#editInvoice')
    await button.trigger('click')
    expect(mockedToggleEditInvFn).toHaveBeenCalled()
  })
  test ('rendering biller Information', ()=> {
    expect(wrapper.find('#invoiceID').text()).toMatch('#ace5fc')
    expect(wrapper.find('#description').text()).toMatch('Electronics')
    expect(wrapper.find('#address').text()).toMatch('Bangalore')
    expect(wrapper.find('#city').text()).toMatch('Udupi')
    expect(wrapper.find('#code').text()).toMatch('576001')
    expect(wrapper.find('#country').text()).toMatch('India')
  })
  test ('calls mockedToggleMode mutation function', ()=> {
    expect(wrapper.find('#name').text()).toMatch('Praveen')
    expect(wrapper.find('#clientAddress').text()).toMatch('Iddya')
    expect(wrapper.find('#clientCity').text()).toMatch('Surathkal')
    expect(wrapper.find('#clientCode').text()).toMatch('575014')
    expect(wrapper.find('#clientCountry').text()).toMatch('India')
    expect(wrapper.find('#dueDate').text()).toMatch('Aug 8, 2022')
  })
  test ('calls mockedToggleMode mutation function', async ()=> {
    expect(wrapper.find('#invoiceTotal').text()).toMatch('₹1,06,000')
  })
})
