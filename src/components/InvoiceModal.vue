<template>
  <div @input="getPos($event)" @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
    <Form
      @submit.prevent="submitForm"
      :style="{color: darkMode ? '#fff' : '#141625', backgroundColor: darkMode ? '#141625' : '#fff' }"
      class="invoice-content"
      :validation-schema="schema"
      >
      <Loading v-show="loading" />
      <h1 v-if="!editInvoice">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input required ref="streetAdd" type="text" id="billerStreetAddress" v-model="billerStreetAddress" />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input required ref="billerCity" type="text" id="billerCity" v-model="billerCity" />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <Field ref="billerPincode" name="pincode" required type="text" id="billerZipCode" v-model="billerZipCode" as="input" />
            <ErrorMessage class="errormsg" name="pincode" />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input required ref="billerCountry" type="text" id="billerCountry" v-model="billerCountry" />
          </div>
        </div>
      </div>
      <div class="checkBoxBill flex">
        <input class="checkBox" type="checkbox" id="BillTo" name="BillTo" v-on:click="checkBoxAddress"/>
        <label for="BillTo"> If Bill To Address is same as Bill From</label>
      </div>
      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input required ref="name" type="text" id="clientName" v-model="clientName" />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <Field name="email" ref="email" required type="text" id="clientEmail" v-model="clientEmail" />
          <ErrorMessage class="errormsg" name="email" />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input required ref="clientStreetAddress" type="text" id="clientStreetAddress" v-model="clientStreetAddress" />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input required ref="clientCity" type="text" id="clientCity" v-model="clientCity" />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <Field name="clientpincode" ref="clientpincode" required type="text" id="clientZipCode" v-model="clientZipCode" />
             <ErrorMessage class="errormsg" name="clientpincode" />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input required ref="clientCountry" type="text" id="clientCountry" v-model="clientCountry" />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input disabled type="text" id="invoiceDate" v-model="invoiceDate" />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate" />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select required type="text" id="paymentTerms" v-model="paymentTerms">
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input required ref="description" type="text" id="productDescription" v-model="productDescription" />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Toal</th>
            </tr>
            <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
              <td class="item-name"><input ref="itemName" type="text" v-model="item.itemName" /></td>
              <td class="qty">
                <input type="number" ref="qty" id="qty" v-model="item.qty" min="1" max="1000" />
              </td>
              <td class="price"><input type="text" ref="price" v-model="item.price" /></td>
              <td class="total flex">₹{{ (item.total = item.qty * item.price).toLocaleString('en-IN') }}</td>
              <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="delete-icon" />
            </tr>
          </table>

          <div id="addNewItem" @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="plus-icon" />
            Add New Item
          </div>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">Cancel</button>
        </div>
        <div class="right flex">
          <button v-if="!editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
          <button v-if="!editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
          <button v-if="editInvoice" type="sumbit" class="purple">Update Invoice</button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
/**
 * This component creates the invoice form component of the app
 * @returns a component with form with all the inputs
 */
import db from "../firebase/firebaseInit";
import Loading from "../components/Loading";
import { Field,Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { mapActions, mapMutations, mapState } from "vuex";
import { uid } from "uid";
export default {
  name: "invoiceModal",
  data() {
    const schema = yup.object({
      email: yup.string().required().email().nullable(),
      pincode: yup.string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6,'Not a Valid Pincode')
      .max(6,'Not a Valid Pincode')
      .nullable(),
      clientpincode: yup.string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6,'Not a Valid Pincode')
      .max(6,'Not a Valid Pincode')
      .nullable(),
    });
    return {
      target: null,
      schema,
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      docId: null,
      loading: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  components: {
    Loading,
    Field,
    Form,
    ErrorMessage
  },
  created() {
    // gets current date for invoice date field
    if (!this.editInvoice) {
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString("en-us", this.dateOptions);
    }

    if (this.editInvoice) {
      const currentInvoice = this.currentInvoiceArray[0];
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },
  methods: {
    ...mapMutations(["TOGGLE_INVOICE", "TOGGLE_MODAL", "TOGGLE_EDIT_INVOICE"]),

    ...mapActions(["UPDATE_INVOICE", "GET_INVOICES"]),

    checkClick(e) {
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL();
      }
    },
    getPos(e) {
      this.target = e.target;
    },
    checkBoxAddress(e){
      if(e.target.checked){
        this.clientStreetAddress= this.billerStreetAddress;
        this.clientCity= this.billerCity;
        this.clientZipCode= this.billerZipCode;
        this.clientCountry= this.billerCountry;
      }
      else{
        this.clientStreetAddress= null;
        this.clientCity= null;
        this.clientZipCode= null;
        this.clientCountry= null;
      }
    },
    closeInvoice() {
      this.TOGGLE_INVOICE();
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE();
      }
    },

    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },

    deleteInvoiceItem(id) {
      this.invoiceItemList = this.invoiceItemList.filter((item) => item.id !== id);
    },

    calInvoiceTotal() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach((item) => {
        this.invoiceTotal += item.total;
      });
    },

    publishInvoice() {
      this.invoicePending = true;
    },

    saveDraft() {
      this.invoiceDraft = true;
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.calInvoiceTotal();

      const dataBase = db.collection("invoices").doc();

      await dataBase.set({
        invoiceId: uid(6),
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        invoiceDate: this.invoiceDate,
        invoiceDateUnix: this.invoiceDateUnix,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null,
      });

      this.loading = false;

      this.TOGGLE_INVOICE();

      this.GET_INVOICES();
    },

    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;

      this.calInvoiceTotal();

      const dataBase = db.collection("invoices").doc(this.docId);

      await dataBase.update({
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      });

      this.loading = false;

      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId,
      };

      this.UPDATE_INVOICE(data);
    },

    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice();
        return;
      }
      this.uploadInvoice();
    },
  },
  computed: {
    ...mapState(["editInvoice", "currentInvoiceArray","darkMode","modalActive"]),
  },
  watch: {
    paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms));
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString("en-us", this.dateOptions);
    },
    modalActive: function() {
      if(!this.modalActive){
        if(this.target===this.$refs.streetAdd) this.$refs.streetAdd.focus();
        else if(this.target===this.$refs.billerCity) this.$refs.billerCity.focus();
        else if(this.target===this.$refs.billerPincode) this.$refs.billerPincode.focus();
        else if(this.target===this.$refs.billerCountry) this.$refs.billerCountry.focus();
        else if(this.target===this.$refs.name) this.$refs.name.focus();
        else if(this.target===this.$refs.email) this.$refs.email.focus();
        else if(this.target===this.$refs.clientStreetAddress) this.$refs.clientStreetAddress.focus();
        else if(this.target===this.$refs.clientCity) this.$refs.clientCity.focus();
        else if(this.target===this.$refs.clientpincode) this.$refs.clientpincode.focus();
        else if(this.target===this.$refs.clientCountry) this.$refs.clientCountry.focus();
        else if(this.target===this.$refs.itemName) this.$refs.itemName.focus();
        else if(this.target===this.$refs.qty) this.$refs.qty.focus();
        else if(this.target===this.$refs.price) this.$refs.price.focus();
        else if(this.target===this.$refs.description) this.$refs.description.focus();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: inherit;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
    .checkBoxBill{
      margin-bottom: 10px;
      //align-content: flex-start;
      .checkBox{
        width: 3%;
        margin-right: 10px;
      }
    }
    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 28px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
    .errormsg{
      color: rgb(255,51,51);
      font-size: 12px;
      font-weight: bold;
    }
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
