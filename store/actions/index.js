import * as actionTypes from '../constants/actionTypes';

const setUser = (user) => {
    return {
        type: actionTypes.SET_USER,
        user,
    };
}

const setOfferList = (offerList) => {
    return {
        type: actionTypes.SET_OFFER_LIST,
        offerList,
    };
}

const setCouponsList = (couponsList) => {
    return {
        type: actionTypes.SET_COUPONS_LIST,
        couponsList,
    };
}

const setTransactionList = (transactionList) => {
    return {
        type: actionTypes.SET_TRANSACTION_LIST,
        transactionList,
    };
}

export {
    setUser,
    setOfferList,
    setCouponsList,
    setTransactionList,
};