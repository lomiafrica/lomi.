import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateCheckoutSessionDto } from './create-checkout-session.dto';

describe('CreateCheckoutSessionDto', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    transform: true,
  });

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CreateCheckoutSessionDto,
    data: '',
  };

  async function transform(
    body: Record<string, unknown>,
  ): Promise<CreateCheckoutSessionDto> {
    return (await pipe.transform(body, metadata)) as CreateCheckoutSessionDto;
  }

  it('keeps checkout session fields that the service forwards after whitelist validation', async () => {
    const transformed = await transform({
      amount: 2500,
      currency_code: 'XOF',
      title: 'Premium setup',
      description: 'One-time service setup',
      customer_id: '11111111-1111-4111-8111-111111111111',
      customer_email: 'ada@example.com',
      customer_name: 'Ada Lovelace',
      customer_phone: '+221771234567',
      customer_city: 'Dakar',
      customer_country: 'SN',
      customer_address: '12 Rue Example',
      customer_postal_code: '12000',
      product_id: '22222222-2222-4222-8222-222222222222',
      price_id: '33333333-3333-4333-8333-333333333333',
      subscription_id: '44444444-4444-4444-8444-444444444444',
      allow_quantity: true,
      quantity: 2,
      success_url: 'https://merchant.example/success',
      cancel_url: 'https://merchant.example/cancel',
      allow_coupon_code: true,
      require_billing_address: true,
      require_email: false,
      require_phone: true,
      require_name: false,
      fields: [
        {
          key: 'email',
          scope: 'system',
          type: 'email',
          visibility: 'hidden',
          order: 10,
        },
        {
          key: 'vat_id',
          scope: 'custom',
          type: 'text',
          visibility: 'required',
          label: 'VAT ID',
          order: 100,
        },
      ],
      payment_link_id: '55555555-5555-4555-8555-555555555555',
      integration_source: 'woocommerce',
      metadata: { wc_order_id: '42' },
      extra_field: 'strip-me',
    });

    expect(transformed).toEqual({
      amount: 2500,
      currency_code: 'XOF',
      title: 'Premium setup',
      description: 'One-time service setup',
      customer_id: '11111111-1111-4111-8111-111111111111',
      customer_email: 'ada@example.com',
      customer_name: 'Ada Lovelace',
      customer_phone: '+221771234567',
      customer_city: 'Dakar',
      customer_country: 'SN',
      customer_address: '12 Rue Example',
      customer_postal_code: '12000',
      product_id: '22222222-2222-4222-8222-222222222222',
      price_id: '33333333-3333-4333-8333-333333333333',
      subscription_id: '44444444-4444-4444-8444-444444444444',
      allow_quantity: true,
      quantity: 2,
      success_url: 'https://merchant.example/success',
      cancel_url: 'https://merchant.example/cancel',
      allow_coupon_code: true,
      require_billing_address: true,
      require_email: false,
      require_phone: true,
      require_name: false,
      fields: [
        {
          key: 'email',
          scope: 'system',
          type: 'email',
          visibility: 'hidden',
          order: 10,
        },
        {
          key: 'vat_id',
          scope: 'custom',
          type: 'text',
          visibility: 'required',
          label: 'VAT ID',
          order: 100,
        },
      ],
      payment_link_id: '55555555-5555-4555-8555-555555555555',
      integration_source: 'woocommerce',
      metadata: { wc_order_id: '42' },
    });
  });

  it('keeps line item metadata while stripping unknown nested fields', async () => {
    const transformed = await transform({
      currency_code: 'XOF',
      line_items: [
        {
          price_id: '66666666-6666-4666-8666-666666666666',
          quantity: 3,
          metadata: { variant: 'large', color: 'blue' },
          ignored: 'strip-me',
        },
      ],
    });

    expect(transformed.line_items).toEqual([
      {
        price_id: '66666666-6666-4666-8666-666666666666',
        quantity: 3,
        metadata: { variant: 'large', color: 'blue' },
      },
    ]);
  });
});
