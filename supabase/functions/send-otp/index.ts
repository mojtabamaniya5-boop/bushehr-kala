import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { mobile } = await req.json()

    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'شماره موبایل نامعتبر است' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { data: recent, error: countErr } = await supabase
      .from('otp_codes')
      .select('id, created_at')
      .eq('mobile', mobile)
      .gte('created_at', tenMinAgo)

    if (countErr) throw countErr

    if (recent && recent.length >= 3) {
      return new Response(
        JSON.stringify({ ok: false, error: 'تعداد درخواست زیاد است' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const hasRecent = recent && recent.some(r => Date.now() - new Date(r.created_at).getTime() < 60000)
    if (hasRecent) {
      return new Response(
        JSON.stringify({ ok: false, error: 'لطفاً ۶۰ ثانیه صبر کنید' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    await supabase.from('otp_codes').update({ used: true }).eq('mobile', mobile).eq('used', false)

    const { error: insertErr } = await supabase
      .from('otp_codes')
      .insert({ mobile, code, expires_at: expiresAt })

    if (insertErr) throw insertErr

    const smsRes = await fetch(`${Deno.env.get('RELAY_URL')}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-relay-secret': Deno.env.get('RELAY_SECRET'),
      },
      body: JSON.stringify({ mobile, code }),
    })

    const smsData = await smsRes.json()

    if (!smsRes.ok || smsData.status !== 1) {
      console.error('SMS IR error:', smsData)
      return new Response(
        JSON.stringify({ ok: false, error: 'خطا در ارسال پیامک', detail: smsData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'کد ارسال شد' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('send-otp error:', err)
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

