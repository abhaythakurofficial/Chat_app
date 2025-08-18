function setOnlineCount(n) {
    $onlineCount.textContent = `${n} online`;
}

function renderUserList(users) {
    $userList.innerHTML = '';
    users.forEach(u => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition';
        li.innerHTML = `
        <div class="size-2 rounded-full" style="background:${u.color}"></div>
        <span class="text-sm">${u.name}</span>
      `;
        $userList.appendChild(li);
    });
    setOnlineCount(users.length);
}

function addMessage({ name, color, text, system = false }) {
    const wrap = document.createElement('div');
    wrap.className = 'msg-enter';
    if (system) {
        wrap.innerHTML = `<div class="text-xs text-slate-300/80 text-center">${text}</div>`;
    } else {
        const isMe = name === myName;
        wrap.innerHTML = `
        <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-white/10' : 'bg-white/5'} border border-white/10 shadow-lg">
            <div class="text-[11px]" style="color:${color}">${name}</div>
            <div class="text-sm leading-relaxed">${escapeHtml(text)}</div>
          </div>
        </div>
      `;
    }
    $messages.appendChild(wrap);
    $messages.scrollTop = $messages.scrollHeight;
}

function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

$me.textContent = myName;

// --- Socket events ---
socket.on('ident', info => {
    myName = info.name;
    $me.textContent = myName;
});

socket.on('user_list', users => {
    renderUserList(users);
});

socket.on('message', msg => addMessage(msg));

socket.on('system', evt => {
    addMessage({ text: evt.text, system: true });
});

socket.on('typing', () => {
    $typing.classList.remove('hidden');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => $typing.classList.add('hidden'), 1500);
});

// --- UI events ---
$form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = ($input.value || '').trim();
    if (!text) return;
    socket.emit('message', { text });
    $input.value = '';
});

$input.addEventListener('input', () => {
    socket.emit('typing', true);
});

$renameBtn.addEventListener('click', () => {
    const next = prompt('Choose a display name:', myName);
    if (next && next.trim() && next.trim() !== myName) {
        myName = next.trim().slice(0, 24);
        $me.textContent = myName;
        // (Optional) add a server-side rename event to persist this.
    }
});
}) ();
