export interface CartRoverShipmentItem
{
    item: string;
    quantity: number;
    carton_code: string;
    carton_num: string;
    box_length_in: number;
    box_width_in: number;
    box_height_in: number;
    package_weight_lbs: number;
}

export interface CartRoverShipment
{
    carrier: string;
    method: string;
    tracking_no: string;
    tracking_no_secondary: string;
    sscc_barcode: string;
    bill_of_lading: string;
    total_cost: number;
    package_weight_lbs: number;
    dim_weight_lbs: number;
    zone: string;
    delivery_surcharge_type: string;
    whs_location: string;
    box_length_in: number;
    box_width_in: number;
    box_height_in: number;
    date: string;
    tracking_url: string;
    custom_1: string;
    items: CartRoverShipmentItem[];
}

export interface CartRoverViewOrderArgs
{
    include_filtered_items?: boolean;
    include_order_extras?: boolean;
    include_line_extras?: boolean;
    include_aliases?: boolean;
}

export interface CartRoverViewOrderItem
{
    line_no: number;
    item: string;
    lot_number: string | null;
    quantity: number;
    price: string;
    discount: string;
    addl_discount: string;
    extended_amount: string;
    tax: string;
    shipping_surcharge: string;
    line_item_id: string | null;
    line_comment: string | null;
    Description: string | null;
    alt_sku: string | null;
    filtered_sku: 'Y' | 'N' | null;
    line_location: string | null;
}

export interface CartRoverViewOrderResponse
{
    created_date_time?: string;
    updated_date_time?: string;
    record_no?: string | null;
    version?: string | null;
    format?: string | null;
    cust_ref?: string;
    cust_po_no?: string;
    po_number?: string | null;
    carrier?: string | null;
    ship_code?: string | null;
    ship_code_description?: string | null;
    working_ship_code?: string | null;
    cust_company?: string | null;
    cust_title?: string | null;
    cust_first_name?: string | null;
    cust_last_name?: string | null;
    cust_address_1?: string | null;
    cust_address_2?: string | null;
    cust_address_3?: string | null;
    cust_city?: string | null;
    cust_state?: string | null;
    cust_zip?: string | null;
    cust_country?: string | null;
    cust_phone?: string | null;
    cust_e_mail?: string | null;
    ship_company?: string | null;
    ship_title?: string | null;
    ship_first_name?: string | null;
    ship_last_name?: string | null;
    ship_address_1?: string | null;
    ship_address_2?: string | null;
    ship_address_3?: string | null;
    ship_city?: string | null;
    ship_state?: string | null;
    ship_zip?: string | null;
    ship_country?: string | null;
    ship_phone?: string | null;
    ship_e_mail?: string | null;
    ship_address_type?: 'R' | 'C' | null;
    special_services?: string | null;
    customer_id?: string | null;
    order_date?: string | null;
    sub_total?: string | null;
    order_discount?: string | null;
    sales_tax?: string | null;
    shipping_handling?: string | null;
    grand_total?: string | null;
    balance?: string | null;
    currency_code?: string | null;
    credit_card_no?: string | null;
    expiration_date?: string | null;
    pay_type?: string | null;
    tax_exempt_sw?: 'Y' | 'N' | null;
    installment_program?: string | null;
    media_week?: string | null;
    order_source?: string | null;
    promo_code?: string | null;
    ani_phone?: string | null;
    vendor_phone?: string | null;
    check_account_no?: string | null;
    check_type?: string | null;
    check_no?: string | null;
    check_bank_id?: string | null;
    check_cust_bank?: string | null;
    check_cust_id_num?: string | null;
    check_cust_id_state?: string | null;
    check_cust_id_mm?: string | null;
    check_cust_id_dd?: string | null;
    check_cust_id_yy?: string | null;
    check_cust_id_type?: string | null;
    location?: string | null;
    shipping_instructions?: string | null;
    ship_account_no?: string | null;
    ship_account_zip?: string | null;
    pre_auth_code?: string | null;
    pre_auth_amt?: string | null;
    pre_auth_id?: string | null;
    cvv?: string | null;
    custom_field_1?: string | null;
    custom_field_2?: string | null;
    custom_field_3?: string | null;
    custom_field_4?: string | null;
    custom_field_5?: string | null;
    gift_card_sw?: 'Y' | 'N' | null;
    token_sw?: 'Y' | 'N' | null;
    cass_code_ship?: string | null;
    cass_error_ship?: string | null;
    cass_code_cust?: string | null;
    cass_error_cust?: string | null;
    cass_date?: string | null;
    ncoa_code_ship?: string | null;
    ncoa_code_cust?: string | null;
    ncoa_date?: string | null;
    error_code?: string | null;
    error_msg?: string | null;
    ifraud_error_code?: string | null;
    xfraud_error_code?: string | null;
    credit_error_code?: string | null;
    resubmit_date?: string | null;
    black_list?: 'Y' | 'N' | null;
    credit_score?: number | null;
    fraud_score?: number | null;
    load_override_sw?: 'Y' | 'N' | null;
    fail_action?: string | null;
    action_dt?: string | null;
    filename?: string | null;
    call_queue?: string | null;
    clerk_disposition?: string | null;
    clerk_disp_dt?: string | null;
    rep_disposition?: string | null;
    rep_disp_dt?: string | null;
    duplicate_sw?: 'Y' | 'N' | null;
    weight?: number | string | null;
    org_file_no?: string | null;
    gift_message?: string | null;
    gift_wrap?: 'Y' | 'N' | null;
    delete_date?: string | null;
    routing_sw?: 'Y' | 'N' | null;
    sent_to_region?: string | null;
    accepted_by_region?: string | null;
    regional_center?: string | null;
    regional_order_no?: string | null;
    regional_ship_date?: string | null;
    regional_retry_sw?: 'Y' | 'N' | null;
    regional_error?: string | null;
    regional_attempts?: number | null;
    first_attempt?: 'Y' | 'N' | null;
    cancel_date?: string | null;
    cc_last_four?: string | null;
    expected_delivery_date?: string | null;
    requested_ship_date?: string | null;
    delivered_to_wms_date?: string | null;
    error_reason?: string | null;
    mark_in_progress_date?: string | null;
    extra_system_date_sent?: string | null;
    sending_canceled?: 'Y' | 'N' | null;
    shipping_pickup_canceled?: 'Y' | 'N' | null;
    on_hold?: 'Y' | 'N' | null;
    num_failed_sends?: number | null;
    latest_ship_date?: string | null;
    items?: CartRoverViewOrderItem[];
    shipments?: CartRoverShipment[];
}

export interface CartRoverViewOrderApiResponse
{
    success_code: boolean;
    response: CartRoverViewOrderResponse;
}

export interface CartRoverViewOrderStatusResponse
{
    cust_ref: string;
    cust_po_no: string;
    delivered_to_wms_date: string | null;
    updated_date_time: string | null;
    ship_country: string | null;
    order_status: 'new' | 'at_wms' | 'shipped' | 'confirmed' | 'error' | 'canceled';
    shipments: CartRoverShipment[];
}

export interface CartRoverViewOrderStatusApiResponse
{
    success_code: boolean;
    response: CartRoverViewOrderStatusResponse;
}

export interface CartRoverCreateOrderArgs
{
    cust_ref: string;
    cust_po_no?: string;

    // Shipping information
    ship_company?: string;
    ship_title?: string;
    ship_first_name?: string;
    ship_last_name?: string;
    ship_address_1: string;
    ship_address_2?: string;
    ship_address_3?: string;
    ship_city: string;
    ship_state: string;
    ship_zip: string;
    ship_country: string;
    ship_phone?: string;
    ship_e_mail?: string;
    ship_address_type?: 'R' | 'C', // 'R' for residential, 'C' for commercial
    ship_is_billing?: boolean;

    // Billing information
    cust_company?: string; // Required if cust_first_name or cust_last_name is not set
    cust_title?: string;
    cust_first_name?: string;
    cust_last_name?: string;
    cust_address_1?: string;
    cust_address_2?: string;
    cust_address_3?: string;
    cust_city?: string;
    cust_state?: string;
    cust_zip?: string;
    cust_country?: string;
    cust_phone?: string;
    cust_e_mail?: string;
    special_services?: string;
    customer_id?: string;
    order_date?: string; // YYYY-MM-DD format. Defaults to current date
    shipping_instructions?: string;
    ship_account_no?: string;
    ship_code?: string;
    ship_code_description?: string;
    weight?: number;
    gift_message?: string;
    gift_wrap?: 'Y' | 'N';
    carrier?: string;
    routing_sw?: 'Y' | 'N';

    // Price Information
    sub_total?: number;
    order_discount?: number;
    shipping_handling?: number;
    tax_exempt_sw?: 'Y' | 'N';
    sales_tax?: number;
    grand_total?: number;
    balance?: number;
    currency_code?: string;
    
    promo_code?: string;
    custom_field_1?: string;
    custom_field_2?: string;
    custom_field_3?: string;
    custom_field_4?: string;
    custom_field_5?: string;

    // Payment Information
    token_sw?: 'Y' | 'N';
    pay_type?: string;
    credit_card_no?: string;
    cc_last_four?: string;
    expiration_date?: string;
    cvv?: string;
    pre_auth_code?: string;
    pre_auth_amt?: number;
    pre_auth_id?: string;
    gift_card_sw?: 'Y' | 'N';
    check_account_no?: string;
    check_type?: string;
    check_no?: string;
    check_bank_id?: string;
    check_cust_bank?: string;
    check_cust_id_num?: string;
    check_cust_id_state?: string;
    check_cust_id_mm?: string;
    check_cust_id_dd?: string;
    check_cust_id_yy?: string;
    check_cust_id_type?: string;
    installment_program?: string;
    prepaid_order?: 'Y' | 'N';
    black_list?: 'Y' | 'N';
    credit_score?: number;
    fraud_score?: number;
    ifraud_error_code?: string;
    xfraud_error_code?: string;
    credit_error_code?: string;
    
    cass_code_ship?: string;
    cass_error_ship?: string;
    cass_code_cust?: string;
    cass_error_cust?: string;
    cass_date?: string;
    ncoa_code_ship?: string;
    ncoa_code_cust?: string;
    ncoa_date?: string;
    resubmit_date?: string;

    media_week?: string;
    order_source?: string;
    ani_phone?: string;
    vendor_phone?: string;
    location?: string;
    load_override_sw?: 'Y' | 'N';
    fail_action?: string;
    action_dt?: string;
    filename?: string;
    call_queue?: string;
    clerk_disposition?: string;
    clerk_disp_dt?: string;
    rep_disposition?: string;
    rep_disp_dt?: string;
    duplicate_sw?: 'Y' | 'N';
    org_file_no?: string;

    // Optional Routing Information
    regional_center?: string;
    regional_order_no?: string;
    regional_ship_date?: string;
    first_attempt?: 'Y' | 'N';
    expected_delivery_date?: string;
    requested_ship_date?: string;
    extra_fields?: Record<string, string>;
    
    items: CartRoverCreateOrderItemArgs[];
}

export interface CartRoverCreateOrderItemArgs
{
    line_no?: number;
    item: string;
    description?: string;
    price?: number;
    quantity: number;
    discount?: number;
    addl_discount?: number;
    extended_amount?: number;
    tax?: number;
    shipping_subcharge?: number;
    line_comment?: string;
    lot_number?: string;
    line_item_id?: string;
    extra_fields?: Record<string, string>;
}

export interface CartRoverCreateOrderResponse
{
    success_code: boolean;
    cust_ref: string;
    order_number: string;
    error_code?: string;
    message?: string;
}

export interface CartRoverListOrdersArgs
{
    status?: 'new' | 'at_wms' | 'new_or_at_wms' | 'partial' | 'shipped' | 'confirmed' | 'shipped_or_confirmed' | 'error' | 'canceled' | 'any';
    from_date?: string;
    to_date?: string;
    order_source?: string;
    limit?: number; // Defaults to 20 and the maximum is 100
    page?: number; // Defaults to 1
    include_filtered_items?: 'Y' | 'N';
    include_order_extras?: 'Y' | 'N';
    include_line_extras?: 'Y' | 'N';
    include_aliases?: 'Y' | 'N';
}

export interface CartRoverListOrdersResult extends CartRoverCreateOrderArgs
{
    created_date_time: string;
    record_no: string;
    version?: string;
    format?: string;
    cust_ref_original?: string;
    cust_po_no_original?: string;
    working_ship_code?: string;
    sent_to_region?: string;
    accepted_by_region?: string;
    regional_retry_sw: 'Y' | 'N';
    regional_error?: string;
    regional_attempts: string;
    cancel_date?: string;
    delivered_to_wms_date?: string;
    error_reason?: string;
    mark_in_progress_date?: string;
    extra_system_date_sent?: string;
    sending_canceled: 'Y' | 'N';
    shipping_pickup_canceled: 'Y' | 'N';
    on_hold: 'Y' | 'N';
    order_status: 'new' | 'at_wms' | 'shipped' | 'confirmed' | 'error' | 'canceled';
    total_qty: string;
    num_to_ship: string;
    num_shipped: string;
    shipments?: CartRoverShipment[];
}

export interface CartRoverListOrdersResponse
{
    success_code: boolean;
    response: CartRoverListOrdersResult[];
}

export interface CartRoverListOrdersApiResponse
{
    data: CartRoverListOrdersResponse;
    totalRecords?: number;
}

export class CartRoverService
{
    private readonly BASE_URL = 'https://api.cartrover.com/v1';

    private token: string;
    
    constructor(apiUser: string, apiKey: string)
    {
        this.token = btoa(`${apiUser}:${apiKey}`);
    }

    async viewOrder(orderId: string, args: CartRoverViewOrderArgs = {}): Promise<CartRoverViewOrderApiResponse>
    {
        const url = new URL(`${this.BASE_URL}/cart/orders/${orderId}`);

        for (const [key, value] of Object.entries(args)) {
            url.searchParams.set(key, value ? 'Y' : 'N');
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${this.token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    }

    async viewOrderStatus(orderId: string): Promise<CartRoverViewOrderStatusApiResponse>
    {
        const response = await fetch(`${this.BASE_URL}/cart/orders/status/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${this.token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.json();
    }

    async listOrders(args: CartRoverListOrdersArgs = {}): Promise<CartRoverListOrdersApiResponse>
    {
        const url = new URL(`${this.BASE_URL}/cart/orders/list/${args.status || 'any'}`);

        for (const [key, value] of Object.entries(args)) {
            url.searchParams.set(key, String(value));
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${this.token}`,
                'Content-Type': 'application/json',
            },
        });

        const totalRecordsHeader = response.headers.get('total-records');
        const parsedTotalRecords = totalRecordsHeader == null
            ? Number.NaN
            : Number(totalRecordsHeader.trim());
        const totalRecords = Number.isInteger(parsedTotalRecords) && parsedTotalRecords >= 0
            ? parsedTotalRecords
            : undefined;

        const data = (await response.json()) as CartRoverListOrdersResponse;

        return {
            data,
            totalRecords,
        };
    }

    async createOrder(order: CartRoverCreateOrderArgs): Promise<CartRoverCreateOrderResponse>
    {
        const response = await fetch(`${this.BASE_URL}/cart/orders/cartrover`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        return response.json();
    }
}