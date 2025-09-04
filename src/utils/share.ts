import { toast } from 'sonner';

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isIOS = () =>
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) &&
        (navigator as any).maxTouchPoints > 2);
const isChrome = () =>
    /Chrome\/\d+/i.test(navigator.userAgent) &&
    !/Edge|OPR/i.test(navigator.userAgent);
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const normalizeTags = (tags?: string[]) =>
    (tags ?? [])
        .map(t => t.replace(/^#/, '').replace(/\s+/g, ''))
        .filter(Boolean);
const hashLine = (tags?: string[]) =>
    normalizeTags(tags)
        .map(t => `#${t}`)
        .join(' ');

// ---- COPY HELPERS (ưu tiên đồng bộ để giữ user-gesture trên mobile) ----
function copyUsingTextarea(text: string) {
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        Object.assign(ta.style, { position: 'fixed', left: '-9999px' });
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
    } catch {
        return false;
    }
}

async function copyAndroid(line: string) {
    if ('clipboard' in navigator && window.isSecureContext && isChrome()) {
        try {
            await navigator.clipboard.writeText(line);
            return true;
        } catch {}
    }
    return copyUsingTextarea(line);
}

// iOS: chỉ dùng sync textarea
function copyIOS(line: string) {
    return copyUsingTextarea(line);
}
// ---- OPEN FACEBOOK ----
function openIOS(timeout = 1200) {
    const app = `fb://feed`;
    const fallback = 'https://m.facebook.com/';
    let opened = false;
    const onHide = () => {
        opened = true;
        document.removeEventListener('visibilitychange', onHide);
    };
    document.addEventListener('visibilitychange', onHide, { once: true });
    setTimeout(() => {
        if (!opened) window.location.href = fallback;
    }, timeout);
    window.location.assign(app);
}
function openFacebookAndroid(timeout = 1200) {
    const fallback = 'https://m.facebook.com/';
    if (isChrome()) {
        const intent =
            `intent://feed/#Intent;scheme=fb;package=com.facebook.katana;` +
            `S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
        window.location.href = intent;
    } else {
        const appUrl = `fb://feed`;
        setTimeout(() => {
            window.location.href = fallback;
        }, timeout);
        window.location.href = appUrl;
    }
}

type ShareOpts = {
    hashtags?: string[];
    preferApp?: boolean;
    iosOpenAppFirst?: boolean;
};

export async function shareToFacebook({
    hashtags,
    preferApp = true,
    iosOpenAppFirst = true,
}: ShareOpts) {
    const line = hashLine(hashtags);

    // MOBILE
    if (isMobile() && preferApp) {
        if (isIOS() && iosOpenAppFirst) {
            const ok = line ? copyIOS(line) : false;
            if (ok) toast.success('Đã copy hashtag. Hãy dán vào caption.');
            openIOS(); // fb://feed → fallback m.facebook
            return true;
        }
        if (isAndroid()) {
            let ok = false;
            if (line) ok = await copyAndroid(line); // đảm bảo ghi xong rồi mới mở app
            if (ok) toast.success('Đã copy hashtag. Hãy dán vào caption.');
            openFacebookAndroid(); // intent://feed …
            return true;
        }
    }

    // DESKTOP & fallback
    window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer');
    if (line) {
        try {
            await navigator.clipboard.writeText(line);
            toast.success('Đã copy hashtag. Hãy dán vào caption.');
        } catch {
            /* optionally: fallback execCommand here */
        }
    }
    return true;
}
