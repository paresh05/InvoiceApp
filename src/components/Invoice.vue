<template>
  <router-link class="invoice flex" :to="{ name: 'Invoice', params: { invoiceId: invoice.invoiceId } }">
    <div class="left flex">
      <span id="invoiceId" class="tracking-number">#{{ invoice.invoiceId }}</span>
      <span id="paymentDate" class="due-date">{{ invoice.paymentDueDate }}</span>
      <span id="clientName" class="person">{{ invoice.clientName }}</span>
    </div>
    <div class="right flex">
      <span id="clientName" class="price">₹{{ invoice.invoiceTotal.toLocaleString('en-IN') }}</span>
      <div
        class="status-button flex"
        :class="{ paid: invoice.invoicePaid, draft: invoice.invoiceDraft, pending: invoice.invoicePending }"
      >
        <span v-if="invoice.invoicePaid">Paid</span>
        <span v-if="invoice.invoiceDraft">Draft</span>
        <span v-if="invoice.invoicePending">Pending</span>
      </div>
      <div class="icon">
        <img src="@/assets/icon-arrow-right.svg" alt="right-arrow-icon" />
      </div>
    </div>
  </router-link>
</template>

<script>
/**
 * This component creates the invoice component for the Home view
 * @returns a component with of each invoice and its details for displaying in dashboard
 */
export default {
  name: "invoice",
  props: ["invoice"],
};
</script>

<style lang="scss" scoped>
.invoice {
  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;

  span {
    font-size: 13px;
  }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600px;
    }
  }
}
</style>
