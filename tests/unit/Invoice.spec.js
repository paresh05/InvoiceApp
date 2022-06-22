import { shallowMount } from '@vue/test-utils'
import Invoice from '@/components/Invoice'

describe('Home.vue', () => {
  test('renders heading', () => {
    const wrapper = shallowMount(Invoice,{
        props: {
            invoice:{
                invoiceId: '68794',
                paymentDueDate: '28 AUG 2021',
                clientName: 'Paresh',
                invoiceTotal: 5890,
                invoicePaid: true,
                invoiceDraft: false,
                invoicePending: false,
            }
        },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('#invoiceId').exists()).toBe(true)
    expect(wrapper.find('#invoiceId').text()).toMatch('68794')
    expect(wrapper.find('#paymentDate').text()).toMatch('28 AUG 2021')
    expect(wrapper.find('#clientName').text()).toMatch('Paresh')
  })
})