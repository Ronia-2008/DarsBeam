// ============================================
// chat.js
// سیستم پیام‌رسانی درس‌بیم - نسخه کامل
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // داده‌های نمونه
    // ============================================
    const chatData = {
        contacts: [
            {
                id: 1,
                name: 'خانم محمدی',
                role: 'معلم',
                avatar: 'م',
                lastMessage: 'آزمون فردا ساعت ۱۰ برگزار میشه.',
                time: '۱۰:۳۰',
                unread: 2,
                online: true,
                messages: [
                    { id: 1, sender: 'teacher', text: 'سلام علی! چطوری؟', time: '۱۰:۱۵', edited: false },
                    { id: 2, sender: 'student', text: 'سلام استاد! خوبم، شما؟', time: '۱۰:۱۸', edited: false },
                    { id: 3, sender: 'teacher', text: 'آزمون فردا ساعت ۱۰ برگزار میشه.', time: '۱۰:۳۰', edited: false },
                    { id: 4, sender: 'teacher', text: 'حتماً به موقع بیا.', time: '۱۰:۳۱', edited: false },
                ]
            },
            {
                id: 2,
                name: 'آقای کریمی',
                role: 'معلم',
                avatar: 'ک',
                lastMessage: 'جزوه رو دریافت کردی؟',
                time: 'دیروز',
                unread: 0,
                online: false,
                messages: [
                    { id: 5, sender: 'teacher', text: 'جزوه رو دریافت کردی؟', time: '۱۴:۲۰', edited: false },
                    { id: 6, sender: 'student', text: 'بله استاد، گرفتمش.', time: '۱۴:۲۵', edited: false },
                ]
            },
            {
                id: 3,
                name: 'خانم احمدی',
                role: 'مشاور',
                avatar: 'ا',
                lastMessage: 'جلسه مشاوره فردا ساعت ۴',
                time: '۲ روز پیش',
                unread: 0,
                online: true,
                messages: [
                    { id: 7, sender: 'teacher', text: 'جلسه مشاوره فردا ساعت ۴', time: '۱۶:۰۰', edited: false },
                    { id: 8, sender: 'student', text: 'حتماً استاد.', time: '۱۶:۰۵', edited: false },
                ]
            }
        ]
    };

    let currentContactId = 1;
    let currentMessageInput = '';
    let editingMessageId = null;

    // ============================================
    // المان‌ها
    // ============================================
    const contactList = document.querySelector('.chat-contact-list');
    const messagesList = document.getElementById('chatMessagesList');
    const messageInput = document.getElementById('chatMessageInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const chatWithName = document.getElementById('chatWithName');
    const chatStatus = document.getElementById('chatStatus');
    const chatAvatar = document.getElementById('chatAvatar');
    const contextMenu = document.getElementById('contextMenu');
    const inputBox = document.getElementById('inputBox');

    // ============================================
    // 1. رندر لیست مخاطبین
    // ============================================
    function renderContacts() {
        if (!contactList) return;
        contactList.innerHTML = '';

        chatData.contacts.forEach(contact => {
            const item = document.createElement('div');
            item.className = `chat-contact-item ${currentContactId === contact.id ? 'active' : ''}`;
            item.dataset.id = contact.id;
            item.innerHTML = `
                <div class="chat-contact-avatar">${contact.avatar}</div>
                <div class="chat-contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-last-message">${contact.lastMessage}</div>
                    <div class="contact-time">${contact.time}</div>
                </div>
                ${contact.unread > 0 ? `<div class="chat-contact-badge">${contact.unread}</div>` : ''}
            `;

            item.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                openChat(id);
            });

            contactList.appendChild(item);
        });

        const countEl = document.getElementById('chatCount');
        if (countEl) countEl.textContent = chatData.contacts.length;
    }

    // ============================================
    // 2. باز کردن چت
    // ============================================
    function openChat(contactId) {
        currentContactId = contactId;
        const contact = chatData.contacts.find(c => c.id === contactId);
        if (!contact) return;

        if (chatWithName) chatWithName.textContent = contact.name;
        if (chatAvatar) chatAvatar.textContent = contact.avatar;
        if (chatStatus) {
            chatStatus.textContent = contact.online ? '🟢 آنلاین' : '⚪ آفلاین';
            chatStatus.style.color = contact.online ? '#10b981' : 'var(--text-muted)';
        }

        renderContacts();
        renderMessages(contactId);
        contact.unread = 0;
        editingMessageId = null;
        
        if (inputBox) inputBox.classList.remove('editing-mode');
        if (sendBtn) {
            sendBtn.innerHTML = '<i class="bi bi-send"></i>';
            sendBtn.style.background = 'var(--primary-color)';
        }
    }

    // ============================================
    // 3. نمایش پیام‌ها
    // ============================================
    function renderMessages(contactId) {
        if (!messagesList) return;
        const contact = chatData.contacts.find(c => c.id === contactId);
        if (!contact) return;

        messagesList.innerHTML = '';

        let lastDate = '';
        contact.messages.forEach((msg) => {
            const msgDate = msg.time.split(' ')[0] || 'امروز';
            if (msgDate !== lastDate) {
                lastDate = msgDate;
                const divider = document.createElement('div');
                divider.className = 'chat-date-divider';
                divider.innerHTML = `<span>${msgDate}</span>`;
                messagesList.appendChild(divider);
            }

            const messageDiv = document.createElement('div');
            const isSent = msg.sender === 'student';
            messageDiv.className = `chat-message ${isSent ? 'sent' : 'received'}`;
            messageDiv.dataset.messageId = msg.id;
            messageDiv.dataset.sender = msg.sender;
            
            const editBadge = msg.edited ? ' <span style="font-size:10px;opacity:0.6;">(ویرایش)</span>' : '';
            
            messageDiv.innerHTML = `
                <div class="message-text">${msg.text}</div>
                <span class="message-time">${msg.time} ${isSent ? '✓' : ''} ${editBadge}</span>
            `;

            messageDiv.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const messageId = parseInt(this.dataset.messageId);
                const msgData = contact.messages.find(m => m.id === messageId);
                if (msgData) {
                    showContextMenu(e, messageId, msgData.text, msgData.sender);
                }
            });

            messagesList.appendChild(messageDiv);
        });

        messagesList.scrollTop = messagesList.scrollHeight;
    }

    // ============================================
    // 4. منوی context
    // ============================================
    function showContextMenu(e, messageId, text, sender) {
        if (!contextMenu) return;
        
        const isStudent = sender === 'student';
        
        contextMenu.style.display = 'block';
        contextMenu.style.top = Math.min(e.clientY, window.innerHeight - 160) + 'px';
        contextMenu.style.left = Math.min(e.clientX, window.innerWidth - 180) + 'px';
        contextMenu.dataset.messageId = messageId;
        contextMenu.dataset.messageText = text;
        
        const editBtn = contextMenu.querySelector('.menu-item:nth-child(2)');
        const deleteBtn = contextMenu.querySelector('.menu-item:nth-child(3)');
        if (editBtn) editBtn.style.display = isStudent ? 'flex' : 'none';
        if (deleteBtn) deleteBtn.style.display = isStudent ? 'flex' : 'none';
    }

    function closeContextMenu() {
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }

    // ============================================
    // 5. کپی پیام
    // ============================================
    window.copyMessage = function() {
        const text = contextMenu?.dataset?.messageText || '';
        if (!text) {
            notifyError('❌ خطا', 'متن پیام یافت نشد!');
            return;
        }
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                notifySuccess('📋 کپی شد!', 'پیام با موفقیت کپی شد.');
                closeContextMenu();
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            notifySuccess('📋 کپی شد!', 'پیام با موفقیت کپی شد.');
        } catch (err) {
            notifyError('❌ خطا', 'کپی کردن ناموفق بود.');
        }
        document.body.removeChild(textarea);
        closeContextMenu();
    }

    // ============================================
    // 6. ویرایش پیام
    // ============================================
    window.startEditing = function() {
        const messageId = parseInt(contextMenu?.dataset?.messageId);
        const currentText = contextMenu?.dataset?.messageText;
        
        if (!messageId || !currentText) {
            notifyError('❌ خطا', 'پیام برای ویرایش یافت نشد!');
            return;
        }

        const contact = chatData.contacts.find(c => c.id === currentContactId);
        if (!contact) return;
        
        const msg = contact.messages.find(m => m.id === messageId);
        if (!msg || msg.sender !== 'student') {
            notifyError('❌ خطا', 'شما نمی‌توانید این پیام را ویرایش کنید.');
            return;
        }

        editingMessageId = messageId;
        messageInput.value = currentText;
        messageInput.focus();
        messageInput.setSelectionRange(currentText.length, currentText.length);
        if (inputBox) inputBox.classList.add('editing-mode');
        
        sendBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
        sendBtn.style.background = '#10b981';
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        
        closeContextMenu();
        notifyInfo('✏️ ویرایش', 'پیام را ویرایش کنید و روی دکمه سبز کلیک کنید.');
    };

    function saveEditedMessage() {
        const newText = messageInput.value.trim();
        if (!newText) {
            notifyError('❌ خطا', 'متن پیام نمی‌تواند خالی باشد.');
            return;
        }
        if (!editingMessageId) return;

        const contact = chatData.contacts.find(c => c.id === currentContactId);
        if (!contact) return;

        const msg = contact.messages.find(m => m.id === editingMessageId);
        if (!msg) return;

        msg.text = newText;
        msg.edited = true;
        contact.lastMessage = newText;

        cancelEditing();
        renderMessages(currentContactId);
        renderContacts();
        
        notifySuccess('✅ ویرایش شد!', 'پیام با موفقیت ویرایش شد.');
    }

    function cancelEditing() {
        editingMessageId = null;
        messageInput.value = '';
        if (inputBox) inputBox.classList.remove('editing-mode');
        sendBtn.innerHTML = '<i class="bi bi-send"></i>';
        sendBtn.style.background = 'var(--primary-color)';
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.4';
    }

    // ============================================
// 7. حذف پیام با گزینه حذف دوطرفه
// ============================================
window.deleteMessage = async function() {
    // چک کردن وجود darsbeamConfirm
    if (typeof darsbeamConfirm === 'undefined') {
        notifyError('❌ خطا', 'سیستم تأیید بارگذاری نشده است!');
        console.error('❌ darsbeamConfirm تعریف نشده است. فایل modal.js را اضافه کنید.');
        return;
    }

    const messageId = parseInt(contextMenu?.dataset?.messageId);
    if (!messageId || isNaN(messageId)) {
        notifyError('❌ خطا', 'شناسه پیام یافت نشد!');
        return;
    }

    const contact = chatData.contacts.find(c => c.id === currentContactId);
    if (!contact) {
        notifyError('❌ خطا', 'مخاطب یافت نشد!');
        return;
    }

    const msgIndex = contact.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
        notifyError('❌ خطا', 'پیام یافت نشد!');
        return;
    }

    const msg = contact.messages[msgIndex];
    if (msg.sender !== 'student') {
        notifyError('❌ خطا', 'شما نمی‌توانید این پیام را حذف کنید.');
        return;
    }

    // ===== نمایش مودال با گزینه حذف دوطرفه =====
    // برای این کار باید مودال رو با محتوای سفارشی بسازیم
    // از darsbeamConfirm نمیتونیم استفاده کنیم چون چک‌باکس نداره
    // پس یه مودال سفارشی میسازیم
    
    const confirmResult = await showCustomDeleteModal(messageId);
    
    if (!confirmResult) {
        closeContextMenu();
        return;
    }

    // حذف از سمت خودمون
    contact.messages.splice(msgIndex, 1);

    if (contact.messages.length > 0) {
        const lastMsg = contact.messages[contact.messages.length - 1];
        contact.lastMessage = lastMsg.text;
        contact.time = lastMsg.time;
    } else {
        contact.lastMessage = 'پیامی وجود ندارد';
        contact.time = '';
    }

    renderMessages(currentContactId);
    renderContacts();
    closeContextMenu();
    
    notifySuccess('🗑️ حذف شد!', 'پیام با موفقیت حذف شد.');
};

// ============================================
// نمایش مودال سفارشی با گزینه حذف دوطرفه
// ============================================
function showCustomDeleteModal(messageId) {
    return new Promise((resolve) => {
        // ساخت overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'customDeleteModal';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(6px);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: modalFadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div class="modal-box" style="
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                padding: 32px 28px 24px;
                max-width: 400px;
                width: 90%;
                box-shadow: var(--shadow-xl);
                text-align: center;
                position: relative;
                animation: modalBoxIn 0.3s ease;
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 12px;
                    font-size: 28px;
                    color: #ef4444;
                ">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                
                <h3 style="
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin: 0 0 4px;
                ">🗑️ حذف پیام</h3>
                
                <p style="
                    font-size: 15px;
                    color: var(--text-secondary);
                    line-height: 1.6;
                    margin: 0 0 16px;
                ">آیا از حذف این پیام مطمئنی؟</p>
                
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 20px;
                    padding: 10px;
                    background: var(--bg-body);
                    border-radius: var(--radius-sm);
                ">
                    <input type="checkbox" id="deleteBothSides" style="
                        width: 18px;
                        height: 18px;
                        accent-color: var(--primary-color);
                        cursor: pointer;
                    ">
                    <label for="deleteBothSides" style="
                        font-size: 14px;
                        color: var(--text-primary);
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        <i class="bi bi-arrow-left-right"></i>
                        حذف از هر دو طرف
                    </label>
                    <span style="
                        font-size: 12px;
                        color: var(--text-muted);
                    ">(برای طرف مقابل هم حذف شود)</span>
                </div>
                
                <div style="
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                ">
                    <button id="modalCancelDelete" style="
                        padding: 10px 28px;
                        border: 2px solid var(--border-color);
                        border-radius: var(--radius-sm);
                        background: transparent;
                        color: var(--text-secondary);
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        انصراف
                    </button>
                    <button id="modalConfirmDelete" style="
                        padding: 10px 28px;
                        border: none;
                        border-radius: var(--radius-sm);
                        background: #ef4444;
                        color: white;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="bi bi-check-lg"></i>
                        حذف
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // ===== رویدادها =====
        const cancelBtn = overlay.querySelector('#modalCancelDelete');
        const confirmBtn = overlay.querySelector('#modalConfirmDelete');
        const checkbox = overlay.querySelector('#deleteBothSides');

        // بستن با کلیک خارج
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                overlay.remove();
                resolve(false);
            }
        });

        // بستن با ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
                resolve(false);
            }
        };
        document.addEventListener('keydown', escHandler);

        cancelBtn.addEventListener('click', function() {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
            resolve(false);
        });

        confirmBtn.addEventListener('click', function() {
            const deleteBoth = checkbox.checked;
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
            
            // اگه حذف دوطرفه فعال باشه
            if (deleteBoth) {
                // اینجا کد حذف از طرف مقابل رو می‌نویسیم
                // در نسخه واقعی، اینجا درخواست به سرور فرستاده میشه
                notifyInfo('🔄 حذف دوطرفه', 'پیام از هر دو طرف حذف خواهد شد.');
            }
            
            resolve(true);
        });

        // کیبورد: Enter برای تأیید
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && overlay) {
                const deleteBoth = checkbox.checked;
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
                if (deleteBoth) {
                    notifyInfo('🔄 حذف دوطرفه', 'پیام از هر دو طرف حذف خواهد شد.');
                }
                resolve(true);
            }
        });
    });
}

    // ============================================
    // 8. ارسال پیام
    // ============================================
    function sendMessage() {
        if (editingMessageId) {
            saveEditedMessage();
            return;
        }

        const text = messageInput.value.trim();
        if (!text || !currentContactId) return;

        const contact = chatData.contacts.find(c => c.id === currentContactId);
        if (!contact) return;

        const newMessage = {
            id: Date.now(),
            sender: 'student',
            text: text,
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            edited: false
        };
        contact.messages.push(newMessage);
        contact.lastMessage = text;
        contact.time = 'همین الان';

        messageInput.value = '';
        currentMessageInput = '';

        renderMessages(currentContactId);
        renderContacts();

        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.4';

        // پاسخ خودکار
        setTimeout(() => {
            const autoReply = {
                id: Date.now() + 1,
                sender: 'teacher',
                text: '✅ دریافت کردم!',
                time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                edited: false
            };
            contact.messages.push(autoReply);
            contact.lastMessage = autoReply.text;
            contact.time = 'همین الان';
            renderMessages(currentContactId);
            renderContacts();
        }, 1500);
    }

    // ============================================
    // 9. رویدادها
    // ============================================
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            currentMessageInput = this.value.trim();
            if (!editingMessageId) {
                sendBtn.disabled = !currentMessageInput;
                sendBtn.style.opacity = currentMessageInput ? '1' : '0.4';
            }
        });

        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (editingMessageId) {
                    cancelEditing();
                    notifyInfo('❌ انصراف', 'ویرایش لغو شد.');
                }
                closeContextMenu();
            }
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (editingMessageId) {
                    saveEditedMessage();
                } else if (currentMessageInput) {
                    sendMessage();
                }
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.4';
    }

    // بستن منوی context
    document.addEventListener('click', function(e) {
        if (contextMenu && contextMenu.style.display === 'block') {
            if (!contextMenu.contains(e.target)) {
                closeContextMenu();
            }
        }
    });

    // ESC برای بستن منو
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeContextMenu();
        }
    });

    // ============================================
    // 10. جستجو
    // ============================================
    const searchInput = document.getElementById('chatSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            const items = document.querySelectorAll('.chat-contact-item');
            items.forEach(item => {
                const name = item.querySelector('.contact-name')?.textContent?.toLowerCase() || '';
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }

    // ============================================
    // 11. بارگذاری اولیه
    // ============================================
    renderContacts();
    if (chatData.contacts.length > 0) {
        openChat(chatData.contacts[0].id);
    }

    console.log('💬 سیستم پیام‌رسانی با موفقیت بارگذاری شد!');
});