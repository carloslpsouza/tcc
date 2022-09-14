export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: { hospitalId: String};
            new: { hospitalId: String};
            details: { orderId: String, hospitalId: String };
        }
    }
}