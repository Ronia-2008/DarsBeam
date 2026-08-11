// ============================================
// modal.js - مودال اختصاصی درس‌بیم (طراحی جدید)
// ============================================

class DarsBeamModal {
    constructor() {
        this.overlay = null;
        this.resolve = null;
        this.createModal();
    }

    createModal() {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();

        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.innerHTML = `
            <div class="modal-box">
                <button class="modal-close" id="modalClose">
                    <i class="bi bi-x-lg"></i>
                </button>
                <div class="modal-icon" id="modalIcon">
                    <i class="bi bi-question-circle"></i>
                </div>
                <h3 class="modal-title" id="modalTitle">آیا مطمئن هستید؟</h3>
                <p class="modal-text" id="modalText">این عملیات غیرقابل بازگشت است.</p>
                <div class="modal-actions" id="modalActions">
                    <button class="modal-btn modal-btn-cancel" id="modalCancel">
                        انصراف
                    </button>
                    <button class="modal-btn modal-btn-confirm" id="modalConfirm">
                        تأیید
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // رویدادها
        const closeBtn = this.overlay.querySelector('#modalClose');
        const cancelBtn = this.overlay.querySelector('#modalCancel');
        const confirmBtn = this.overlay.querySelector('#modalConfirm');

        closeBtn.addEventListener('click', () => this.close(false));
        cancelBtn.addEventListener('click', () => this.close(false));
        confirmBtn.addEventListener('click', () => this.close(true));

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close(false);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
                this.close(false);
            }
        });
    }

    open(options = {}) {
        return new Promise((resolve) => {
            this.resolve = resolve;

            const {
                title = 'آیا مطمئن هستید؟',
                text = 'این عملیات غیرقابل بازگشت است.',
                icon = 'question-circle',
                confirmText = 'تأیید',
                cancelText = 'انصراف',
                type = 'danger'
            } = options;

            const iconEl = this.overlay.querySelector('#modalIcon i');
            const titleEl = this.overlay.querySelector('#modalTitle');
            const textEl = this.overlay.querySelector('#modalText');
            const confirmBtn = this.overlay.querySelector('#modalConfirm');
            const cancelBtn = this.overlay.querySelector('#modalCancel');
            const actions = this.overlay.querySelector('#modalActions');
            const iconContainer = this.overlay.querySelector('#modalIcon');

            // آیکون
            iconEl.className = `bi bi-${icon}`;

            // رنگ آیکون
            if (type === 'danger') {
                iconContainer.style.background = 'rgba(239, 68, 68, 0.08)';
                iconContainer.style.color = '#ef4444';
                confirmBtn.className = 'modal-btn modal-btn-confirm';
            } else if (type === 'success') {
                iconContainer.style.background = 'rgba(16, 185, 129, 0.08)';
                iconContainer.style.color = '#10b981';
                confirmBtn.className = 'modal-btn modal-btn-confirm success';
            } else {
                iconContainer.style.background = 'rgba(37, 99, 235, 0.08)';
                iconContainer.style.color = 'var(--primary-color)';
                confirmBtn.className = 'modal-btn modal-btn-confirm info';
            }

            // متن‌ها
            titleEl.textContent = title;
            textEl.textContent = text;
            confirmBtn.innerHTML = confirmText;
            cancelBtn.textContent = cancelText;

            // مخفی کردن دکمه‌ی انصراف اگه نباشه
            if (!cancelText || cancelText === '') {
                actions.classList.add('single');
            } else {
                actions.classList.remove('single');
            }

            this.overlay.classList.add('active');
        });
    }

    close(result) {
        this.overlay.classList.remove('active');
        if (this.resolve) this.resolve(result);
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
        }, 300);
    }

    static async confirm(options) {
        const modal = new DarsBeamModal();
        return await modal.open(options);
    }
}

// ============================================
// جایگزینی confirm پیش‌فرض
// ============================================
window.darsbeamConfirm = async function(options) {
    if (typeof options === 'string') {
        options = { text: options };
    }
    return await DarsBeamModal.confirm(options);
};

console.log('📦 مودال جدید درس‌بیم بارگذاری شد!');