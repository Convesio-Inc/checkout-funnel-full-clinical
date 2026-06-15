import { queryOptions } from '@tanstack/react-query'
import { getOrders, getSearchOrders, type SearchOrdersArgs } from '@/lib/orders'
import type { CartRoverListOrdersArgs } from '../../worker/services/cart-rover'

export const listOrdersQueryOptions = (args: CartRoverListOrdersArgs = {}) => {
    return queryOptions({
        queryKey: ['orders', args],
        queryFn: () => getOrders(args),
    })
}

export const searchOrdersQueryOptions = (args: SearchOrdersArgs = {}) => {
    return queryOptions({
        queryKey: ['search-orders', args],
        queryFn: () => getSearchOrders(args),
    })
}