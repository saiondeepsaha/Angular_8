// mocking the response for testing
export const credentials = { email: "farmerone@ffs.com", password: "Farmer#1" };
export const credentials2 = { email: "customerone@ffs.com", password: "Customer#1" };

const farmerOne = {
  id: 1,
  name: "farmer one",
  mobile: "6666666666",
  email: "farmerone@ffs.com",
  address: "xxx yyy zzz",
  password: "Farmer#1",
  userType: "farmers"
}

const farmerTwo = {
  id: 2,
  name: "farmer two",
  mobile: "7777777777",
  email: "farmertwo@ffs.com",
  address: "xxx yyy zzz",
  password: "Farmer#2",
  userType: "farmers"
}

const farmerThree = {
  id: 3,
  name: "farmer three",
  mobile: "7777777777",
  email: "farmerthree@ffs.com",
  address: "xxx yyy zzz",
  password: "Farmer#3",
  userType: "farmers"
}

export const MockFarmers = [farmerOne, farmerTwo];

export const MockAltFarmers = [farmerThree];

const customerOne = {
  id: 1,
  name: "customer one",
  mobile: "9999999999",
  email: "customerone@ffs.com",
  address: "xxx yyy zzz",
  password: "Customer#1",
  userType: "customers"
}

const customerTwo = {
  id: 2,
  name: "customer two",
  mobile: "6000000000",
  email: "customertwo@ffs.com",
  address: "xxx yyy zzz",
  password: "Customer#2",
  userType: "customers"
}

const customerThree = {
  id: 2,
  name: "customer three",
  mobile: "6000000000",
  email: "customerthree@ffs.com",
  address: "xxx yyy zzz",
  password: "Customer#3",
  userType: "customers"
}

export const MockCustomers = [customerOne, customerTwo];

export const MockAltCustomers = [customerThree];

const productOne = {
  id: 1,
  unit: "count",
  pricePerUnit: 25,
  name: "Plantain Stem",
  stock: 120,
  belongsTo: 1
}

const productTwo = {
  id: 2,
  unit: "kg",
  pricePerUnit: 120,
  name: "Polished Rice",
  stock: 50,
  belongsTo: 1
}

const productThree = {
  id: 3,
  unit: "count",
  pricePerUnit: 15,
  name: "Coconut",
  stock: 0,
  belongsTo: 2
}

const productFour = {
  id: 4,
  unit: "kg",
  pricePerUnit: 30,
  name: "Beans",
  stock: 100,
  belongsTo: 2
}

export const MockProducts = [productOne, productTwo, productThree];

export const MockAltProducts = [productFour];