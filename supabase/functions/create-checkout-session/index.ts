import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.8.0?target=deno'

import { corsHeaders } from '../_shared/cors.ts'
import { Database } from '../../../src/utils/supabaseTypes.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
})


serve(async (request: Request) => {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(
        JSON.stringify({ message: 'ok' }), {
        headers: corsHeaders,
        status: 200,
      })
    }

    if (request.method === 'POST') {
      const { origin, orderId, checkoutProducts } = await request.json()

      if (!origin) {
        return new Response(
          JSON.stringify({ errorMessage: 'Missing field (origin)' }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 400,
        })
      }

      if (!orderId) {
        return new Response(
          JSON.stringify({ errorMessage: 'Missing field (orderId)' }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 400,
        })
      }

      if (!checkoutProducts) {
        return new Response(
          JSON.stringify({ errorMessage: 'Missing field (checkoutProducts)' }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 400,
        })
      }

      const session = await stripe.checkout.sessions.create({
        line_items: checkoutProducts.map((product: Database['public']['Tables']['products']['Row']) => ({
          price_data: {
            currency: 'inr',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price ? product.price * 100 : 0,
          },
          quantity: 1,
        })),
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${origin}/${orderId}/checkout/success`,
        cancel_url: `${origin}/${orderId}/checkout/cancel`,
      })

      return new Response(
        JSON.stringify({ sessionId: session.id }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ errorMessage: 'Internal Server Error' }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 500,
    })
  }
})