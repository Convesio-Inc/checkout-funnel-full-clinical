import type { CartRoverListOrdersResponse, CartRoverListOrdersArgs } from '../../worker/services/cart-rover'
import type { SearchOrderFilters } from '../../worker/db/order-search'

export interface OrdersPagination {
    page: number
    perPage: number
    totalCount: number
    totalPages: number
}

export interface ListOrdersResponse extends CartRoverListOrdersResponse {
    pagination: OrdersPagination
}

export interface SearchOrdersArgs extends SearchOrderFilters {
    page?: number
}

export const getOrders = async (args: CartRoverListOrdersArgs): Promise<ListOrdersResponse> => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(args)) {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value))
        }
    }
    const qs = params.toString()
    const res = await fetch(`/list-orders${qs ? `?${qs}` : ''}`)

    const pagination: OrdersPagination = {
        page:       Number(res.headers.get('X-Page')        ?? '1'),
        perPage:    Number(res.headers.get('X-Per-Page')    ?? '20'),
        totalCount: Number(res.headers.get('X-Total-Count') ?? '0'),
        totalPages: Number(res.headers.get('X-Total-Pages') ?? '0'),
    }

    const body = (await res.json()) as CartRoverListOrdersResponse
    return { ...body, pagination }
}

export const getSearchOrders = async (args: SearchOrdersArgs): Promise<ListOrdersResponse> => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(args)) {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value))
        }
    }
    const qs = params.toString()
    const res = await fetch(`/search-orders${qs ? `?${qs}` : ''}`)

    const pagination: OrdersPagination = {
        page:       Number(res.headers.get('X-Page')        ?? '1'),
        perPage:    Number(res.headers.get('X-Per-Page')    ?? '20'),
        totalCount: Number(res.headers.get('X-Total-Count') ?? '0'),
        totalPages: Number(res.headers.get('X-Total-Pages') ?? '0'),
    }

    const body = (await res.json()) as CartRoverListOrdersResponse
    return { ...body, pagination }
}