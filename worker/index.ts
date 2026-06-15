import { handleGoogleCallback } from './handlers/auth/google-callback';
import { handleGoogleStart } from './handlers/auth/google-start';
import { handleLogin } from './handlers/auth/login';
import { handleLogout } from './handlers/auth/logout';
import { handleRegister } from './handlers/auth/register';
import { handleSession } from './handlers/auth/session';
import { handleConfig } from './handlers/config/config';
import { handleIssueToken } from './handlers/payments/issue-token';
import { handleListOrders } from './handlers/orders/list-orders';
import { handleListPayments } from './handlers/payments/list-payments';
import { handlePayments } from './handlers/payments/payments';
import { handlePollPayment } from './handlers/payments/poll-payment';
import { handleSearchOrders } from './handlers/orders/search-orders';
import { handleSyncPayments } from './handlers/payments/sync-payments';
import { handleCreateUser } from './handlers/users/create-user';
import { handleDeleteUser } from './handlers/users/delete-user';
import { handleGetUser } from './handlers/users/get-user';
import { handleListUsers } from './handlers/users/list-users';
import { handleSearchUsers } from './handlers/users/search-users';
import { handleUpdateUser } from './handlers/users/update-user';
import { handleUpsellPayment } from './handlers/payments/upsell-payment';
import { handleVerifyToken } from './handlers/payments/verify-token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth/register' && request.method === 'POST') {
      return handleRegister(request, env);
    }

    if (url.pathname === '/auth/login' && request.method === 'POST') {
      return handleLogin(request, env);
    }

    if (url.pathname === '/auth/google/start' && request.method === 'GET') {
      return handleGoogleStart(request, env);
    }

    if (url.pathname === '/auth/google/callback' && request.method === 'GET') {
      return handleGoogleCallback(request, env);
    }

    if (url.pathname === '/auth/session' && request.method === 'GET') {
      return handleSession(request, env);
    }

    if (url.pathname === '/auth/logout' && request.method === 'POST') {
      return handleLogout(request, env);
    }

    if (url.pathname === '/config' && request.method === 'GET') {
      return handleConfig(env);
    }

    if (url.pathname === '/list-payments' && request.method === 'GET') {
      return handleListPayments(request, env);
    }

    if (url.pathname === '/list-orders' && request.method === 'GET') {
      return handleListOrders(request, env);
    }

    if (url.pathname === '/search-orders' && request.method === 'GET') {
      return handleSearchOrders(request, env);
    }

    if (url.pathname === '/users' && request.method === 'GET') {
      return handleListUsers(request, env);
    }

    if (url.pathname === '/users/search' && request.method === 'GET') {
      return handleSearchUsers(request, env);
    }

    if (url.pathname === '/users' && request.method === 'POST') {
      return handleCreateUser(request, env);
    }

    const userIdMatch = url.pathname.match(/^\/users\/(\d+)$/);
    if (userIdMatch) {
      const userId = Number(userIdMatch[1]);
      if (!Number.isInteger(userId) || userId < 1) {
        return new Response(
          JSON.stringify({
            error: true,
            message: 'Invalid user id.',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          },
        );
      }

      if (request.method === 'DELETE') {
        return handleDeleteUser(request, env, userId);
      }

      if (request.method === 'GET') {
        return handleGetUser(request, env, userId);
      }

      if (request.method === 'PATCH') {
        return handleUpdateUser(request, env, userId);
      }
    }

    if (url.pathname === '/payments' && request.method === 'POST') {
      return handlePayments(request, env);
    }

    if (url.pathname === '/verify-token' && request.method === 'POST') {
      return handleVerifyToken(request, env);
    }

    if (url.pathname === '/issue-token' && request.method === 'POST') {
      return handleIssueToken(request, env);
    }

    if (url.pathname === '/poll-payment' && request.method === 'POST') {
      return handlePollPayment(request, env);
    }

    if (url.pathname === '/upsell-payment' && request.method === 'POST') {
      return handleUpsellPayment(request, env);
    }

    return new Response(null, { status: 404 });
  },

  async scheduled(event: ScheduledController, env: Env) {
    switch (event.cron) {
      case '0 */2 * * *':
        await handleSyncPayments(env);
        break;
      default:
        break;
    }
  },
} satisfies ExportedHandler<Env>;
