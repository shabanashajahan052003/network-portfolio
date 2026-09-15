/* ==========================================================================
   SHABANA S - JUNIOR NETWORK ENGINEER PORTFOLIO
   Interactive Engine & Interactive NOC Tools
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNetworkCanvas();
    initTerminalEngine();
    initSubnetCalculator();
    initWiresharkInspector();
    initFilters();
    initCopyButtons();
    initContactForm();
    initMobileNav();
    initScrollEffects();
});

/* -------------------------------------------------------------------------- */
/* 1. BACKGROUND NETWORK CONSTELLATION & PACKET PULSE CANVAS                  */
/* -------------------------------------------------------------------------- */
function initNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const nodes = [];
    const nodeCount = Math.min(Math.floor(width / 18), 70);
    const packets = [];

    // Create Nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2 + 1.5,
            color: Math.random() > 0.3 ? '#06b6d4' : '#3b82f6'
        });
    }

    // Packet Spawner Interval
    setInterval(() => {
        if (nodes.length < 2) return;
        const i1 = Math.floor(Math.random() * nodes.length);
        let i2 = Math.floor(Math.random() * nodes.length);
        if (i1 === i2) return;

        const n1 = nodes[i1];
        const n2 = nodes[i2];
        const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);

        if (dist < 140) {
            packets.push({
                x: n1.x,
                y: n1.y,
                targetX: n2.x,
                targetY: n2.y,
                progress: 0,
                speed: 0.015 + Math.random() * 0.02
            });
        }
    }, 400);

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    const alpha = (1 - dist / 130) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw Nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = node.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw Active Data Packets travelling
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.progress += p.speed;

            if (p.progress >= 1) {
                packets.splice(i, 1);
                continue;
            }

            const currX = p.x + (p.targetX - p.x) * p.progress;
            const currY = p.y + (p.targetY - p.y) * p.progress;

            ctx.beginPath();
            ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#10b981';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* -------------------------------------------------------------------------- */
/* 2. INTERACTIVE NOC COMMAND TERMINAL WIDGET                                 */
/* -------------------------------------------------------------------------- */
function initTerminalEngine() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    if (!terminalInput || !terminalBody) return;

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command) {
                executeTerminalCommand(command, terminalBody);
            }
            terminalInput.value = '';
        }
    });
}

function executeTerminalCommand(cmdStr, container) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'terminal-output';
    
    // Command line append
    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt-symbol">shabana@noc-console:~$</span> ${escapeHTML(cmdStr)}`;
    container.insertBefore(line, container.querySelector('.terminal-prompt-line'));

    const parts = cmdStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] || '';

    let result = '';

    switch (cmd) {
        case 'help':
            result = `Available commands:
  help                    - Display command list
  whoami                  - View engineer profile summary
  ping <host>             - Simulate ICMP ping test (e.g. ping google.com)
  traceroute <host>       - Simulate network route tracing
  subnet <IP/CIDR>        - Calculate IPv4 subnet (e.g. subnet 192.168.1.0/24)
  skills                  - List core technical competencies
  cat resume              - View resume link & overview
  clear                   - Clear terminal screen`;
            break;

        case 'whoami':
            result = `[SHABANA S] - Junior Network Engineer | NOC Trainee
Location: Al-Qusais, Dubai, UAE
Focus: Network Infrastructure, Routing & Switching, TCP/IP, VLANs, Wireshark, AWS Cloud.
Education: B.Tech in CSE (TKM Institute of Technology, CGPA: 7.95/10)`;
            break;

        case 'ping':
            const target = arg || '8.8.8.8';
            result = `PING ${target} (56 data bytes):
64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.24 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.98 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=1.15 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=1.02 ms
--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max = 0.98/1.09/1.24 ms`;
            break;

        case 'traceroute':
            const traceTarget = arg || 'shabana-noc.dubai.ae';
            result = `traceroute to ${traceTarget}, 30 hops max, 60 byte packets
 1  gateway.local (192.168.1.1)  0.412 ms  0.395 ms
 2  isp-core-router.dubai.ae (10.240.1.1)  2.140 ms  2.080 ms
 3  edge-switch-01.noc.ae (172.16.50.2)  4.310 ms  4.205 ms
 4  shabana-noc-node (192.168.10.100)  5.120 ms  5.090 ms [REACHED]`;
            break;

        case 'subnet':
            const subnetArg = arg || '192.168.1.0/24';
            const calc = parseAndCalculateSubnet(subnetArg);
            if (calc.error) {
                result = `Error: ${calc.error}. Usage example: subnet 192.168.1.0/24`;
            } else {
                result = `Subnet Breakdown for ${subnetArg}:
  IP Address:       ${calc.ip}
  Network Address:  ${calc.network}
  Broadcast Addr:   ${calc.broadcast}
  Subnet Mask:      ${calc.mask}
  Usable Host Range:${calc.firstUsable} - ${calc.lastUsable}
  Total Usable Hosts: ${calc.usableHosts}`;
            }
            break;

        case 'skills':
            result = `[TECHNICAL SKILLS]
• Networking: TCP/IP, OSI Model, IPv4, Subnetting, CIDR, DHCP, DNS, NAT, VLANs, LAN/WAN
• Diagnostics: Wireshark Packet Inspection, Cisco Packet Tracer, Ping, Traceroute, Fault Isolation
• Cloud & IT: AWS VPC, EC2, IAM, Linux, Windows Server, Hardware/Software Support
• Code/Database: Python, SQL, MySQL, JavaScript`;
            break;

        case 'cat':
            if (arg.toLowerCase() === 'resume') {
                result = `Resume File: resume/Shabana_shajahan.pdf
Direct Download: Click 'Download CV' button in header or hero section.`;
            } else {
                result = `cat: ${arg}: No such file or directory. Try 'cat resume'.`;
            }
            break;

        case 'clear':
            // Clear previous outputs except prompt
            const outputs = container.querySelectorAll('.terminal-output, .terminal-prompt-line:not(:last-child)');
            outputs.forEach(el => el.remove());
            container.scrollTop = container.scrollHeight;
            return;

        default:
            result = `command not found: ${cmd}. Type 'help' for a list of valid NOC commands.`;
            break;
    }

    outputDiv.innerText = result;
    container.insertBefore(outputDiv, container.querySelector('.terminal-prompt-line'));
    container.scrollTop = container.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/* -------------------------------------------------------------------------- */
/* 3. LIVE REAL-TIME SUBNET CALCULATOR ENGINE                                 */
/* -------------------------------------------------------------------------- */
function initSubnetCalculator() {
    const ipInput = document.getElementById('calc-ip');
    const cidrSelect = document.getElementById('calc-cidr');

    if (!ipInput || !cidrSelect) return;

    const updateCalc = () => {
        const ip = ipInput.value.trim() || '192.168.1.1';
        const cidr = parseInt(cidrSelect.value) || 24;
        const res = calculateSubnetDetails(ip, cidr);

        document.getElementById('res-network').innerText = res.network;
        document.getElementById('res-broadcast').innerText = res.broadcast;
        document.getElementById('res-mask').innerText = res.mask;
        document.getElementById('res-range').innerText = `${res.firstUsable} - ${res.lastUsable}`;
        document.getElementById('res-hosts').innerText = res.usableHosts;
        document.getElementById('res-wildcard').innerText = res.wildcard;
    };

    ipInput.addEventListener('input', updateCalc);
    cidrSelect.addEventListener('change', updateCalc);
    updateCalc(); // Run initial
}

function parseAndCalculateSubnet(str) {
    const parts = str.split('/');
    if (parts.length !== 2) return { error: 'Invalid CIDR notation format' };
    const ip = parts[0];
    const cidr = parseInt(parts[1]);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return { error: 'CIDR prefix must be between /0 and /32' };
    return calculateSubnetDetails(ip, cidr);
}

function calculateSubnetDetails(ipStr, cidr) {
    const ipNum = ipToLong(ipStr);
    if (ipNum === null) {
        return {
            ip: ipStr, network: 'Invalid IP', broadcast: 'Invalid IP',
            mask: '-', firstUsable: '-', lastUsable: '-', usableHosts: 0, wildcard: '-'
        };
    }

    const maskNum = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const wildcardNum = (~maskNum) >>> 0;
    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardNum) >>> 0;

    let totalHosts = Math.pow(2, 32 - cidr);
    let usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

    let firstUsableNum = cidr >= 31 ? networkNum : networkNum + 1;
    let lastUsableNum = cidr >= 31 ? broadcastNum : broadcastNum - 1;

    return {
        ip: ipStr,
        network: longToIp(networkNum),
        broadcast: longToIp(broadcastNum),
        mask: longToIp(maskNum),
        wildcard: longToIp(wildcardNum),
        firstUsable: longToIp(firstUsableNum),
        lastUsable: longToIp(lastUsableNum),
        usableHosts: usableHosts.toLocaleString()
    };
}

function ipToLong(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;
    let num = 0;
    for (let i = 0; i < 4; i++) {
        const n = parseInt(parts[i]);
        if (isNaN(n) || n < 0 || n > 255) return null;
        num = (num << 8) + n;
    }
    return num >>> 0;
}

function longToIp(long) {
    return [
        (long >>> 24) & 255,
        (long >>> 16) & 255,
        (long >>> 8) & 255,
        long & 255
    ].join('.');
}

/* -------------------------------------------------------------------------- */
/* 4. WIRESHARK PACKET FRAME INSPECTOR                                        */
/* -------------------------------------------------------------------------- */
function initWiresharkInspector() {
    const layers = document.querySelectorAll('.packet-layer');
    layers.forEach(layer => {
        layer.addEventListener('click', () => {
            layers.forEach(l => l.classList.remove('active'));
            layer.classList.add('active');
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 5. FILTERING ENGINES FOR SKILLS AND PROJECTS                               */
/* -------------------------------------------------------------------------- */
function initFilters() {
    // Skill Filter
    const skillFilters = document.querySelectorAll('.skills-filter .filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            skillCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Project Filter
    const projFilters = document.querySelectorAll('.projects-filter .filter-btn');
    const projCards = document.querySelectorAll('.project-card-wrapper');

    projFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            projFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 6. COPY TO CLIPBOARD AND TOAST NOTIFICATIONS                              */
/* -------------------------------------------------------------------------- */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.dataset.copy;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied "${textToCopy}" to clipboard!`);
                });
            }
        });
    });
}

function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${escapeHTML(message)}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* -------------------------------------------------------------------------- */
/* 7. CONTACT FORM HANDLING                                                   */
/* -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;

        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Transmitting Message...`;
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('Thank you! Your message has been sent to Shabana.');
            form.reset();
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/* -------------------------------------------------------------------------- */
/* 8. MOBILE NAV TOGGLE & SCROLL EFFECTS                                      */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const links = document.querySelector('.nav-links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        toggle.querySelector('i').classList.toggle('fa-bars');
        toggle.querySelector('i').classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
            if (toggle.querySelector('i')) {
                toggle.querySelector('i').classList.add('fa-bars');
                toggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });
}

function initScrollEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}
