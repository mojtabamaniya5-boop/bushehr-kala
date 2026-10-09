import Header from '../components/Header'
import { SHOP_INFO } from '../data/products'

const SECTIONS = [
  {
    title: '۱. ثبت سفارش',
    items: [
      'سفارش پس از تکمیل فرم تسویه حساب و پرداخت (کارت به کارت یا آنلاین) ثبت می‌شود.',
      'کد پیگیری سفارش پس از ثبت، در صفحه تأیید نمایش داده می‌شود.',
      'مشتری موظف است اطلاعات تماس و آدرس را دقیق وارد کند.',
    ],
  },
  {
    title: '۲. روش‌های پرداخت',
    items: [
      'پرداخت آنلاین از طریق درگاه‌های معتبر بانکی.',
      'پرداخت کارت به کارت + ارسال رسید در پیام‌رسان بله.',
      'سفارش پس از تأیید پرداخت، وارد مرحله آماده‌سازی می‌شود.',
    ],
  },
  {
    title: '۳. ارسال و تحویل',
    items: [
      'ارسال سریع: ۲ تا ۳ روز کاری.',
      'ارسال عادی: ۳ تا ۵ روز کاری.',
      'هزینه ارسال در صفحه تسویه حساب قابل مشاهده است.',
      'برای سفارش‌های بالای ' + SHOP_INFO.freeShippingFrom.toLocaleString('fa-IR') + ' تومان، ارسال رایگان است.',
    ],
  },
  {
    title: '۴. مرجوعی و بازگشت',
    items: [
      'با توجه به ماهیت مواد غذایی، امکان بازگشت کالا فقط در صورت معیوب بودن وجود دارد.',
      'در صورت آسیب‌دیدگی در حین ارسال، مشتری باید تا ۲۴ ساعت پس از دریافت، اطلاع دهد.',
      'هزینه بازگشت در صورت تأیید نقص، بر عهده فروشگاه است.',
    ],
  },
  {
    title: '۵. حفظ حریم خصوصی',
    items: [
      'اطلاعات شخصی مشتریان نزد کافه ترشی محفوظ است.',
      'اطلاعات تماس فقط برای ارسال سفارش و پشتیبانی استفاده می‌شود.',
      'هیچ اطلاعاتی با اشخاص ثالث به اشتراک گذاشته نمی‌شود.',
    ],
  },
  {
    title: '۶. قوانین عمومی',
    items: [
      'استفاده از مطالب و تصاویر سایت بدون اجازه کتبی ممنوع است.',
      'قیمت‌ها ممکن است بنا به شرایط بازار تغییر کند.',
      'کافه ترشی حق لغو سفارش در شرایط خاص را محفوظ می‌دارد.',
    ],
  },
]

export default function Terms() {
  return (
    <>
      <Header title="قوانین و مقررات" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">

        <div className="bg-brand-light/40 rounded-2xl p-4 mb-5 border border-brand/20">
          <p className="text-xs text-ink leading-6 text-center">
            با ثبت سفارش در کافه ترشی، شما <b>قوانین زیر</b> را می‌پذیرید.
          </p>
        </div>

        {SECTIONS.map((sec, i) => (
          <section key={i} className="bg-white rounded-2xl p-4 border border-border mb-3">
            <h2 className="font-extrabold text-sm text-brand mb-3">{sec.title}</h2>
            <ul className="space-y-2">
              {sec.items.map((item, j) => (
                <li key={j} className="flex gap-2 text-xs text-ink leading-6">
                  <span className="text-accent font-extrabold flex-shrink-0">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="bg-white rounded-2xl p-4 border border-border mt-4">
          <p className="text-[11px] text-muted leading-6 text-center">
            آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۱۵<br/>
            برای هرگونه سؤال با پشتیبانی <b className="text-brand">کافه ترشی</b> تماس بگیرید.
          </p>
        </div>

      </main>
    </>
  )
}
