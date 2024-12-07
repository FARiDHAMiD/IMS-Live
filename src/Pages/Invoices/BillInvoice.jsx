import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../Components/AxiosInstance";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import dayjs from "dayjs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { useTheme } from "../../context/ThemeProvider";

const BillInvoice = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [oneItem, setOneItem] = useState([]);
  let [accounts, setAccounts] = useState([]);
  let [accountData, setAccountData] = useState([]);
  let [items, setItems] = useState([]); // all items for dropdown list
  let [stocks, setStocks] = useState([]); // choose stock to add qty
  let [selectedStock, setSelectedStock] = useState(1); // choose stock to add qty
  let [payTypes, setPayTypes] = useState([]);
  let [payType, setPayType] = useState();
  let [hideAccountDetails, setHideAccountDetails] = useState(true);
  let [loading, setLoading] = useState(true);
  let [selectPrice, setSelectPrice] = useState(1);
  let [creditCheckbox, setCreditCheckbox] = useState(false);
  let [userProfile, setUserProfile] = useState([]);
  let navigate = useNavigate();

  const initCredit = accountData.credit; // initial account credit
  const qtyRef = useRef();
  const unitSelectRef = useRef();

  let [subTotal, setSubTotal] = useState("0.00");
  const [total, setTotal] = useState("0.00");
  const [paid, setPaid] = useState("0.00");
  const [taxRate, setTaxRate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  const [invoiceItems, setInvoiceItems] = useState([
    // {
    //   id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
    //   item_name: "",
    //   name: "", // use id
    //   stock_qty: "",
    //   qty: 1,
    //   selling_price: "0.00",
    //   itemSubTotal: "",
    //   scale_unit: "",
    //   small_unit: "",
    //   last_price: "",
    //   lowest_price: "",
    //   unitRef: 1,
    // },
  ]);

  let getUserProfile = async () => {
    let response = await AxiosInstance.get(`profile/${user.profile}`);
    setUserProfile(response.data);
  };

  // calculate invoice
  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = invoiceItems
      .reduce((acc, item) => {
        item.itemSubTotal =
          parseFloat(item.selling_price) * parseFloat(item.qty);
        return acc + parseFloat(item.selling_price) * parseFloat(item.qty);
      }, 0)
      .toFixed(2);

    let newtaxAmount = (newSubTotal * (taxRate / 100)).toFixed(2);
    let newdiscountAmount = (newSubTotal * (discountRate / 100)).toFixed(2);
    let newTotal = (
      newSubTotal -
      newdiscountAmount +
      parseFloat(newtaxAmount)
    ).toFixed(2);

    setSubTotal(newSubTotal);
    setTaxAmount(newtaxAmount);
    setDiscountAmount(newdiscountAmount);
    setTotal(newTotal);
    setAccountData["credit"] =
      (accountData.credit || accountData.credit == 0) &&
      -parseFloat(total) + parseFloat(accountData.credit) + parseInt(paid);
  }, [invoiceItems, taxRate, discountRate, paid, accountData.credit, total]);

  // delete row
  const handleRowDel = (item) => {
    const updatedItems = invoiceItems.filter((i) => i.id !== item.id);
    setInvoiceItems(updatedItems);
  };

  // add new row
  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      item_id: "",
      item_name: "",
      name: "",
      stock_qty: "",
      selling_price: "0.00",
      qty: 0,
      itemSubTotal: "",
      scale_unit: "",
      small_unit: "",
      small_in_large: "",
      last_price: "",
      lowest_price: "",
      lowest_price_small: "",
      unitRef: 1,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  let disableDiscountRate = () => {
    document.getElementById("discountRate").disabled = true;
  };

  let disableDiscountAmount = () => {
    document.getElementById("discountAmount").disabled = true;
  };

  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const handleItemChange = (selectedOption, event) => {
    setSelectedOption(selectedOption);
    // You can access the `event` here, which contains target details
    console.log(selectedOption); // Logs the event object
    console.log(event); // Logs the event object
    console.log(event.target); // Logs the target DOM element if needed
    // const selectNode = selectRef.current;
    // console.log(selectNode);  // You can now interact with the DOM element directly
  };

  // edit field in row
  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;
    const updatedItems = invoiceItems.map((item) => {
      if (item.id === id) {
        if (name === "name") {
          getItem(evt.target);
        } else if (name == "itemInput_name") {
          getItem(evt.target);
        } else if (name === "unitSelect") {
          if (value == 1) {
            item.selling_price = (
              item.selling_price * item.small_in_large
            ).toFixed(0); // later to calculate small to large unit value
          } else {
            item.selling_price = (
              item.selling_price / item.small_in_large
            ).toFixed(2); // later to calculate small to large unit value
          }
          item.unitRef = value; // reference to calculate price and quantity based on selected unit
        } else if (name == "selling_price") {
          (item.unitRef == 1 && item.selling_price <= item.lowest_price) ||
          (item.unitRef == 2 && item.selling_price <= item.lowest_price_small)
            ? (item.qty = NaN)
            : "";
        }
        return { ...item, [name]: value };
      } else {
        return item;
      }
    });
    setInvoiceItems(updatedItems);
  };

  // get one item for one row
  let getItem = async (target) => {
    // let response = await AxiosInstance.get(`item/${target.value}`);
    // Get Item By name not id --- temp solution .....
    let response = await AxiosInstance.get(`itemByName/${target.value}/`);
    // get selected item last price from previous client invoices
    // review performance later .............
    let invoiceItemResponse = await AxiosInstance.get(
      `accountInvoiceItem/${accountData.id || 0}`
    );
    let result = invoiceItemResponse.data.map((invoice) =>
      invoice.invoice_items
        .map((itm) => {
          if (itm.item == invoice.item.filter((x) => x == target.value)) {
            return itm.price;
          } else {
            return 0;
          }
        })
        .filter((x) => x !== 0)
    );
    let lastPrice = result.filter((x) => x.length !== 0)[0]; // last price to same account

    // choose selling prices - جملة او قطاعى
    let responsePrice =
      selectPrice == 2
        ? response.data.retail_price
        : response.data.selling_price;

    setOneItem(response.data);
    oneItem.selling_price = responsePrice;

    const updatedItems = invoiceItems.map((item) => {
      const { id, name, value } = target;
      if (item.id == id) {
        item.item_id = response.data.id;
        item.item_name = response.data.name;
        response.data.stock.filter((st) => {
          if (st.stock == selectedStock) {
            item.stock_qty = st.item_qty;
          }
        });
        item.scale_unit = response.data.scale_unit;
        item.small_unit = response.data.small_unit;
        item.lowest_price = response.data.lowest_price || 0;
        item.lowest_price_small = // اقل سعر عند اختيار الوحدة الأصغر
          response.data.lowest_price / response.data.small_in_large || 0;
        item.small_in_large = response.data.small_in_large;
        item.barcode = response.data.barcode;
        // item last price
        item.last_price = lastPrice || 0;

        // check selected unit to apply price
        if (unitSelectRef.current.id == id) {
          if (unitSelectRef.current.value == 1) {
            item.selling_price = responsePrice;
          } else if (unitSelectRef.current.value == 2) {
            //small_unit price
            item.selling_price = (responsePrice / item.small_in_large).toFixed(
              2
            );
          }
        } else {
          item.selling_price = "error"; //temp force show error bug ...
        }
      } else {
        return item;
      }
      return { ...item, [name]: value };
    });

    setInvoiceItems(updatedItems);
    setAccountData["credit"] = initCredit; // temp -- will be updated on multi items
  };

  let getStocks = async () => {
    let response = await AxiosInstance.get(`stock`);
    setStocks(response.data);
  };

  useEffect(() => {
    getUserProfile();
    getAccounts();
    getItems();
    getPayTypes();
    getStocks();
    handleCalculateTotal();
    unitSelectRef;
  }, [handleCalculateTotal, oneItem]);

  let getAccountData = async (id) => {
    if (id == 0) {
      setAccountData([]);
    } else {
      let response = await AxiosInstance.get(`account/${id}`);
      setAccountData(response.data);
      setAccountData["credit"] = response.data.credit;
      setHideAccountDetails(false);
    }
  };

  let getAccounts = async () => {
    let response = await AxiosInstance.get(`account`);
    setAccounts(response.data);
    setLoading(false);
  };

  let getItems = async () => {
    let response = await AxiosInstance.get(`stock-items/${selectedStock}/`);
    setItems(response.data);
  };

  let getPayTypes = async () => {
    let response = await AxiosInstance.get(`payType`);
    setPayTypes(response.data);
  };

  items.map((item) => (
    <option key={item.item_info.id} value={item.item_info.id}>
      {item.item_info.name}
    </option>
  ));

  // items options
  const itemOptions = items.map((item) => {
    return {
      id: item.item_info.id,
      label: item.item_info.cat__name + " | " + item.item_info.name,
      value: item.item_info.name,
    };
  });

  // account options
  const accountOptions = accounts.map((account) => {
    return {
      id: account.id,
      label: account.name + " | " + account.account_type,
      value: account.name,
    };
  });

  const defaultValues = {
    type: "",
    pay_type: "",
    invoice_by: "",
    invoice_time: "",
    total: total,
    discount: null,
    tax: null,
    paid: "",
    notes: "",
    account: "",
  };

  // Using react hook form ...
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let createInvoice = (data) => {
    // update application user credit
    let newUserCredit = accountData.id
      ? parseInt(userProfile.credit) + parseInt(paid)
      : parseInt(userProfile.credit) + parseInt(total);

    let saved_data = {
      type: 1,
      pay_type: data.pay_type,
      invoice_by: user.user_id,
      invoice_time: dayjs().format(),
      due_date: data.due_date || null,
      total: total,
      tax: taxAmount,
      discount: discountAmount,
      subCredit: data.subCredit,
      paid: paid,
      prevCredit: initCredit,
      remain:
        setAccountData["credit"] &&
        parseFloat(setAccountData["credit"]).toFixed(2) != NaN
          ? parseFloat(setAccountData["credit"]).toFixed(2)
          : null,
      notes: data.notes,
      account: accountData.id || null,
    };

    // check if no items selected
    if (
      invoiceItems.map((item) => item.item_name)[0] == "" ||
      invoiceItems.length < 1
    ) {
      toast.error(`يجب تسجيل صنف عالأقل`);
    } else {
      try {
        // check duplicate invoice items
        let array = invoiceItems.map((itm) => itm.item_name);
        const duplicates = array.filter(
          (item, index) => array.indexOf(item) !== index
        );

        // check if any qty = 0
        const invoiceItemsQtys = invoiceItems.map((itm) => itm.qty);

        // check total is not null & no duplicates & no items with 0 qty
        if (
          !isNaN(total) &&
          total >= 0 &&
          duplicates.length == 0 &&
          !invoiceItemsQtys.includes(0)
        ) {
          // store items data in last invoice
          AxiosInstance.post(`invoice/`, saved_data).then((res) => {
            for (let i = 0; i < invoiceItems.length; i++) {
              let item_data = {
                // invoice: // try to get last invoice id ; handled from backend
                item: invoiceItems.map((itm) => parseInt(itm.item_id))[i], // use as item id
                item_name: invoiceItems.map((itm) => itm.item_name)[i], // item name
                stock_qty: invoiceItems.map((itm) => itm.stock_qty)[i], // item previous qty
                price: invoiceItems.map((itm) =>
                  itm.unitRef == 1
                    ? parseFloat(itm.selling_price)
                    : parseFloat(itm.selling_price) *
                      parseFloat(itm.small_in_large)
                )[i],
                qty: invoiceItems.map((itm) =>
                  itm.unitRef == 1
                    ? parseFloat(itm.qty)
                    : parseFloat(itm.qty / itm.small_in_large).toFixed(3)
                )[i],
              };
              // store invoice items *** need fixes
              AxiosInstance.post(`invoices/storeInvoiceItems/`, item_data);

              // update item update info
              AxiosInstance.put(`item/${item_data.item}/`, {
                name: item_data.item_name,
                last_order_by: user.username,
                last_order_time: dayjs().format(),
              });
              // update item qty
              AxiosInstance.put(
                `updateStockItem/${selectedStock}/${item_data.item}/`,
                {
                  item_qty:
                    parseFloat(item_data.stock_qty) - parseFloat(item_data.qty),
                }
              );
            }

            // calculate new account balance
            accountData.id &&
              AxiosInstance.put(`account/${accountData.id}/`, {
                name: accountData.name,
                account_type: accountData.account_type,
                company: accountData.company,
                archived_at: accountData.archived_at,
                credit: parseFloat(setAccountData["credit"]).toFixed(2),
                // credit: newBalance,
              });

            AxiosInstance.put(`profile/${user.profile}/`, {
              credit: newUserCredit,
            });

            toast.success(`تم تسجيل فاتورة جديدة بنجاح`, res.status);
            navigate(`/invoice`);
          });
        } else {
          toast.error(`خطأ بالأصناف ... أصناف مكررة - كمية 0`);
        }
      } catch (error) {
        toast.error(`خطأ بالتسجيل`, error);
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="modal-dialog">
          <div className="modal-content rounded-4 shadow">
            <div className="container-fluid row mb-2">
              <div className="p-3 pb-4 border-bottom-0">
                <div className="row">
                  <div className="col-7">
                    <h3
                      className={`fw-bold mb-0 fs-2 ${
                        theme == `dark` ? `text-green` : `text-navy`
                      }`}
                    >
                      فاتورة بيع
                    </h3>
                  </div>
                  <div className="col-5 mt-2">
                    <select
                      className={`form-select ${
                        theme == "dark" ? "text-info" : "text-navy"
                      }`}
                      onChange={(e) => {
                        setSelectedStock(e.target.value);
                        setInvoiceItems([]);
                      }}
                    >
                      {stocks.map((stock) => (
                        <option key={stock.id} value={stock.id}>
                          {stock.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* account data */}
              <div className="col-md-4 col-12 mb-2">
                <Select
                  isClearable
                  onChange={(e) =>
                    e
                      ? getAccountData(e.id)
                      : [setHideAccountDetails(true), getAccountData(0)]
                  }
                  options={accountOptions}
                  placeholder={`العميل...`}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: `${theme == "dark" ? "#212529" : ""}`,
                      borderColor: "navy",
                      fontSize: "18px",
                      width: "100%",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: `${theme == "dark" ? "white" : "black"}`,
                    }),
                    menu: (provided) => ({
                      ...provided,
                      background: "",
                      color: "black",
                    }),
                  }}
                  menuPosition="fixed"
                />
              </div>

              <div className="col-md-2 col-6">
                <input
                  type="text"
                  defaultValue={
                    setAccountData["credit"] || setAccountData["credit"] == 0
                      ? setAccountData["credit"].toLocaleString() + ` ج.م.`
                      : accountData.credit &&
                        accountData.credit.toLocaleString() &&
                        accountData.credit.toLocaleString() + ` ج.م.`
                  }
                  className="form-control"
                  style={
                    theme == "dark"
                      ? {
                          backgroundColor:
                            setAccountData["credit"] < 0 && `red`,
                        }
                      : { borderColor: setAccountData["credit"] < 0 && `red` }
                  }
                  disabled
                  hidden={hideAccountDetails || (!user.is_staff && true)}
                />
              </div>

              <div className="col-md-3 col-6 mb-2">
                <select
                  hidden={hideAccountDetails}
                  name="pay_type"
                  id="pay_type"
                  {...register("pay_type", {
                    required: accountData.id && true,
                  })}
                  className="form-control"
                  onChange={(e) => setPayType(e.target.value)}
                >
                  <option value="">طريقة السداد...</option>
                  {payTypes.map((type) => (
                    <option key={type.name} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 col-12 mb-2">
                <input
                  hidden={hideAccountDetails}
                  type="text"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  name="due_date"
                  id="due_date"
                  {...register(
                    "due_date",
                    payType == 2 && {
                      required: true,
                      min: {
                        value: dayjs().format(),
                      },
                      message: "يجب إدخال آخر موعد للسداد",
                    }
                  )}
                  className={`form-control ${errors.due_date && "is-invalid"}`}
                  placeholder="آخر موعد للسداد..."
                />
                {errors.name && (
                  <div role="alert" className="text-danger">
                    {errors.due_date.message}
                  </div>
                )}
              </div>

              {/* discount rate  */}
              <div className="col-md-3 col-6  mb-2">
                <input
                  type="number"
                  id="discountRate"
                  min="0.00"
                  max="100.00"
                  value={discountRate}
                  name="discountRate"
                  className="form-control"
                  {...register("discount")}
                  placeholder="الخصم %"
                  onChange={(e) =>
                    e.target.value > 100 || e.target.value < 0
                      ? handleCalculateTotal(setDiscountRate(0))
                      : handleCalculateTotal(
                          setDiscountRate(parseFloat(e.target.value) || 0)
                        )
                  }
                  onFocus={disableDiscountAmount}
                />
              </div>

              {/* discount by amount - خصم بالمبلغ  */}
              <div className="col-md-3 col-6  mb-2">
                <input
                  type="number"
                  id="discountAmount"
                  min="0.00"
                  max={total}
                  className="form-control"
                  placeholder="الخصم بالجنيه"
                  onChange={(e) =>
                    handleCalculateTotal(
                      setDiscountRate(
                        parseFloat((e.target.value / subTotal) * 100).toFixed(2)
                      )
                    )
                  }
                  onFocus={disableDiscountRate}
                />
              </div>

              {/* Tax  */}
              <div className="col-md-3 col-6 mb-2">
                <input
                  type="number"
                  min="0.00"
                  max="100.00"
                  value={taxRate}
                  name="taxRate"
                  {...register("tax")}
                  className="form-control"
                  placeholder="الضريبة %"
                  onChange={(e) =>
                    e.target.value > 100 || e.target.value < 0
                      ? handleCalculateTotal(setTaxRate(0))
                      : handleCalculateTotal(setTaxRate(e.target.value))
                  }
                />
              </div>

              {/* select prices /  */}
              <div className="col-md-3 col-6 mb-2">
                <select
                  name="selectPrice"
                  className="form-control"
                  onChange={(e) => setSelectPrice(e.target.value)}
                  id=""
                >
                  <option value="">--البيع بسعر--</option>
                  <option value="1">جملة</option>
                  <option value="2">قطاعى</option>
                </select>
              </div>

              {/* notes */}
              <div className="col-md-8 col-6 mb-2">
                <input
                  type="text"
                  name="notes"
                  id="notes"
                  className="form-control"
                  placeholder="ملاحظات الفاتورة ..."
                  {...register("notes")}
                />
              </div>

              {/* paid */}
              <div className="col-md-4 col-6 mb-2">
                <input
                  // hidden={hideAccountDetails}
                  type="number"
                  name="paid"
                  id="paid"
                  className="form-control"
                  placeholder="المدفوع ..."
                  {...register("paid")}
                  onChange={(e) =>
                    e.target.value <= 0
                      ? handleCalculateTotal(setPaid(0))
                      : handleCalculateTotal(setPaid(e.target.value))
                  }
                />
              </div>
            </div>
            <hr />

            {/* Invoice Items rows  */}
            <div className="container modal-body">
              {invoiceItems.map((item, i) => (
                <div key={i} className="container-fluid row">
                  {/* item name */}
                  <div className="col-md-3 col-8 mb-1">
                    <label
                      style={{ fontSize: "small" }}
                      className={theme == "dark" ? "text-info" : "text-navy"}
                    >
                      الصنف
                    </label>
                    <select
                      name="name"
                      id={item.id}
                      onChange={onItemizedItemEdit}
                      value={item.name}
                      className="form-control form-control-sm"
                      hidden // temp for testing get item by name
                    >
                      <option value="" disabled>
                        --- إختر صنف ---
                      </option>
                      {items.map((item) => (
                        <option
                          key={item.item_info.id}
                          value={item.item_info.id}
                        >
                          {item.item_info.name}
                        </option>
                      ))}
                    </select>
                    <input
                      className="form-control form-control-sm"
                      list="data"
                      id={item.id}
                      onChange={(e) => onItemizedItemEdit(e)}
                      name="itemInput_name"
                    />
                    <datalist id="data">
                      {items.map((item) => (
                        <option
                          key={item.item_info.id}
                          value={item.item_info.name}
                        >
                          {item.item_info.cat__name +
                            " | " +
                            item.item_info.name}
                        </option>
                      ))}
                    </datalist>
                    {/* temp for testing get item by name */}
                    <div hidden>
                      <Select
                        hidden // temp for testing get item by name
                        isClearable
                        options={options}
                        value={selectedOption}
                        onChange={handleItemChange}
                        placeholder={`إختر الصنف`}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: `${
                              theme == "dark" ? "#212529" : ""
                            }`,
                            borderColor: "navy",
                            fontSize: "18px",
                            width: "100%",
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: `${theme == "dark" ? "white" : "black"}`,
                          }),
                          menu: (provided) => ({
                            ...provided,
                            background: "",
                            color: "black",
                          }),
                        }}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>

                  {/* item unit */}
                  <div className="col-md-1 col-4">
                    <label
                      style={{ fontSize: "small" }}
                      className={theme == "dark" ? "text-info" : "text-navy"}
                    >
                      الوحدة
                    </label>
                    <select
                      ref={unitSelectRef}
                      name="unitSelect"
                      id={item.id}
                      className="form-control form-control-sm"
                      onChange={onItemizedItemEdit}
                      defaultValue={item.scale_unit}
                    >
                      <option value="1">{item.scale_unit}</option>
                      <option value="2">{item.small_unit}</option>
                    </select>
                  </div>

                  {/* item qty */}
                  <div className="col-md-2 col-4 mb-1">
                    <label
                      style={{ fontSize: "small" }}
                      className={theme == "dark" ? "text-info" : "text-navy"}
                    >
                      الكمية
                    </label>
                    <input
                      ref={qtyRef}
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="الكمية..."
                      name="qty"
                      value={item.qty}
                      id={item.id}
                      onChange={(e) =>
                        e.target.value < 0 ? "" : onItemizedItemEdit(e)
                      }
                      disabled={
                        (item.unitRef == 1 &&
                          item.selling_price < item.lowest_price) ||
                        (item.unitRef == 2 &&
                          item.selling_price < item.lowest_price_small &&
                          true)
                      }
                    />
                  </div>

                  {/* item price */}
                  <div className="col-md-2 col-4">
                    <label
                      style={{ fontSize: "small" }}
                      className={theme == "dark" ? "text-info" : "text-navy"}
                    >
                      السعر
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="السعر..."
                      name="selling_price"
                      value={item.selling_price}
                      id={item.name && item.id}
                      onChange={(e) =>
                        e.target.value <= 0 ? "" : onItemizedItemEdit(e)
                      }
                      disabled={!item.name && true} // temp solution ...
                      style={{
                        borderColor:
                          (item.unitRef == 1 &&
                            item.selling_price <= item.lowest_price) ||
                          (item.unitRef == 2 &&
                            item.selling_price <= item.lowest_price_small)
                            ? "red"
                            : "",
                        backgroundColor:
                          (item.unitRef == 1 &&
                            item.selling_price <= item.lowest_price) ||
                          (item.unitRef == 2 &&
                            item.selling_price <= item.lowest_price_small)
                            ? "grey"
                            : "",
                      }}
                    />
                  </div>

                  {/* item sub total */}
                  <div className="col-md-2 col-4">
                    <label
                      style={{ fontSize: "small" }}
                      className={theme == "dark" ? "text-info" : "text-navy"}
                    >
                      إجمالى
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="قيمة..."
                      name="itemSubTotal"
                      value={
                        (item.unitRef == 1 &&
                          item.selling_price >= item.lowest_price) ||
                        (item.unitRef == 2 &&
                          item.selling_price >= item.lowest_price_small)
                          ? parseFloat(item.itemSubTotal).toFixed(2)
                          : NaN
                      }
                      id={item.id}
                      disabled
                    />
                  </div>

                  {/* item last price */}
                  <div className="col-md-1 col-5">
                    <label
                      style={{ fontSize: "small" }}
                      className={theme == "dark" ? "text-info" : "text-navy"}
                    >
                      آخر سعر
                    </label>
                    <br />
                    <label
                      className={
                        item.last_price != 0
                          ? theme == `dark`
                            ? `text-info`
                            : `text-success`
                          : ``
                      }
                      style={{ fontSize: "small" }}
                    >
                      {item.last_price
                        ? item.last_price + ` لل` + item.scale_unit
                        : ""}
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="آخر سعر للعميل..."
                      name="last_price"
                      id={item.id}
                      value={
                        item.last_price &&
                        item.last_price + ` EGP لل` + item.scale_unit
                      }
                      style={{
                        borderColor: item.last_price != 0 && "yellow",
                      }}
                      disabled
                      hidden
                    />
                  </div>

                  {/* delete row button  */}
                  <div className="col-md-1 col-7">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      style={{ float: "left" }}
                      onClick={() => handleRowDel(item)}
                    >
                      x
                    </button>
                  </div>
                  <hr
                    className={`my-1 ${
                      theme == "dark" ? "text-warning" : ""
                    } mt-3`}
                  />
                </div>
              ))}

              {/* add row button  */}
              <div className=" mb-1 d-flex justify-content-center mt-1">
                <button
                  className={
                    theme == `dark`
                      ? "btn btn-outline-light"
                      : "btn btn-outline-dark"
                  }
                  onClick={handleAddEvent}
                >
                  <FaPlus />
                </button>
              </div>

              {/* Invoice Total */}
              <hr />
              <div
                className={`col-md-6 col-12 ${
                  theme == "dark" ? "text-warning" : ""
                } m-1`}
                style={{ float: "left" }}
              >
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">قيمة الأصناف:</span>
                  <span>{subTotal} ج.م.</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">الخصم:</span>
                  <span>
                    <span className="small ">
                      (
                      {(discountRate && parseFloat(discountRate).toFixed(2)) ||
                        0}
                      %){" "}
                    </span>
                    {discountAmount + ` ج.م.` || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">ضريبة:</span>
                  <span>
                    <span className="small ">
                      ({(taxRate && parseFloat(taxRate).toFixed(2)) || 0}%){" "}
                      {` `}
                    </span>
                    {taxAmount + ` ج.م.` || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">إجمالى الفاتورة:</span>
                  <span className="fw-bold">{total || 0} ج.م.</span>
                </div>
                <hr />

                {/* hide previous account credit if not staff  */}
                <div hidden={!user.is_staff && true}>
                  {/* previous credit  */}
                  {accountData.id && (
                    <>
                      <div
                        className="d-flex flex-row align-items-start justify-content-between"
                        style={{ fontSize: "1.125rem" }}
                      >
                        <span
                          className={`fw-bold ${
                            theme == "dark" ? "text-light" : "text-muted"
                          }`}
                        >
                          حساب سابق:{" "}
                          {accountData.credit > 0 ? (
                            <span
                              className={
                                theme == `dark` ? "text-info" : "text-muted"
                              }
                            >
                              له
                            </span>
                          ) : (
                            accountData.credit && (
                              <span className={`text-danger`}>عليه</span>
                            )
                          )}
                        </span>
                        <span
                          className={`fw-bold ${
                            accountData.credit > 0
                              ? theme == `dark`
                                ? "text-info"
                                : "text-muted"
                              : accountData.credit
                              ? `text-danger`
                              : `text-light`
                          } `}
                        >
                          {accountData.credit && accountData.credit < 0
                            ? (-accountData.credit - accountData.credit) / 2
                            : accountData.credit}{" "}
                          ج.م.
                        </span>
                      </div>
                      <div
                        className="d-flex flex-row align-items-start justify-content-between"
                        style={{ fontSize: "1.125rem" }}
                      >
                        <span
                          className={`fw-bold ${
                            theme == "dark" ? "text-light" : "text-muted"
                          }`}
                        >
                          إجمالى الحساب:
                        </span>
                        <span
                          className={
                            theme == `dark`
                              ? "fw-bold text-warning"
                              : "fw-bold text-muted"
                          }
                        >
                          {(accountData.credit || accountData.credit == 0) &&
                            (+total - accountData.credit).toLocaleString()}{" "}
                          ج.م.
                        </span>
                      </div>
                      <div
                        className="d-flex flex-row align-items-start justify-content-between"
                        style={{ fontSize: "1.125rem" }}
                      >
                        <span
                          className={`fw-bold ${
                            theme == "dark" ? "text-light" : "text-muted"
                          }`}
                        >
                          مدفوع:{" "}
                        </span>
                        <span
                          className={`fw-bold ${
                            theme == "dark" ? "text-light" : "text-muted"
                          }`}
                        >
                          {paid || 0} ج.م.
                        </span>
                      </div>
                      <div
                        className="d-flex flex-row align-items-start justify-content-between"
                        style={{ fontSize: "1.125rem" }}
                      >
                        <span
                          className={`fw-bold ${
                            theme == "dark" ? "text-light" : "text-muted"
                          }`}
                        >
                          متبقى:{" "}
                        </span>
                        <span
                          className={`fw-bold ${
                            theme == "dark" ? "text-light" : "text-muted"
                          }`}
                        >
                          {(accountData.credit || accountData.credit == 0) &&
                            (
                              total -
                              accountData.credit -
                              paid
                            ).toLocaleString()}{" "}
                          ج.م.
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* save invoice  */}
            <div className="d-flex justify-content-center my-2">
              <button
                className={theme == `dark` ? `btn btn-info` : "btn btn-success"}
                onClick={handleSubmit(createInvoice)}
              >
                حفظ <FaRegSave />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillInvoice;
