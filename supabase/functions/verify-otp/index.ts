import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { mobile, code } = await req.json()
    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return new Response(JSON.stringify({ ok: false, error: 'شماره نامعتبر' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!code || !/^\d{6}$/.test(code)) {
      return new Response(JSON.stringify({ ok: false, error: 'کد نامعتبر' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const { data: rows, error: selErr } = await supabase
      .from('otp_codes').select('*').eq('mobile', mobile).eq('used', false).eq('code', code)
      .order('created_at', { ascending: false }).limit(1)
    if (selErr) throw selErr
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'کد اشتباه است' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const otp = rows[0]
    if (new Date(otp.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ ok: false, error: 'کد منقضی شده' }), { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (otp.attempts >= 5) {
      await supabase.from('otp_codes').update({ used: true }).eq('id', otp.id)
      return new Response(JSON.stringify({ ok: false, error: 'تعداد تلاش زیاد' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    await supabase.from('otp_codes').update({ used: true }).eq('id', otp.id)
    return new Response(JSON.stringify({ ok: true, mobile }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
