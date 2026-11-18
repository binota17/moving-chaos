// =========================================================================
// UI & HUD MANAGER
// =========================================================================
import { t } from '../../src3d/i18n.js';

export class UIManager {
  constructor() {
    this.containerEl = document.getElementById('game-container');
    this.truckCountEl = document.getElementById('truck-count');
    this.scoreTextEl = document.getElementById('score-text');
    this.timerTextEl = document.getElementById('timer-text');
    this.rageFillEl = document.getElementById('rage-fill');
    this.bonusHudEl = document.getElementById('bonus-hud-pill');
    this.comboHudEl = document.getElementById('combo-hud-pill');

    this.p1HudEl = document.getElementById('p1-hud');
    this.p1StatusEl = document.getElementById('p1-status');
    this.p2HudEl = document.getElementById('p2-hud');
    this.p2StatusEl = document.getElementById('p2-status');

    this.deliveryFeedEl = document.getElementById('delivery-feed');
    this.startOverlayEl = document.getElementById('start-overlay');
    this.pauseOverlayEl = document.getElementById('pause-overlay');
    this.gameoverOverlayEl = document.getElementById('gameover-overlay');

    this.endTitleEl = document.getElementById('end-title');
    this.endSubEl = document.getElementById('end-sub');
    this.finalStarsEl = document.getElementById('final-stars');
    this.finalStarBreakdownEl = document.getElementById('final-star-breakdown');
    this.finalRecordBadgeEl = document.getElementById('final-record-badge');
    this.finalEarningsEl = document.getElementById('final-earnings');
    this.finalStatsEl = document.getElementById('final-stats');
    this.finalRankEl = document.getElementById('final-rank');
    this.finalQuoteEl = document.getElementById('final-quote');
  }

  updateHUD(itemsDelivered, targetItems, score, timeLeft, landlordRage, p1, p2, is2PMode, extra = {}) {
    if (this.truckCountEl) this.truckCountEl.innerText = `${itemsDelivered}/${targetItems}`;
    if (this.scoreTextEl) this.scoreTextEl.innerText = score.toLocaleString('vi-VN') + 'đ';
    if (this.timerTextEl) {
      this.timerTextEl.innerText = timeLeft < 0 ? `♾️ ${Math.abs(timeLeft + 1)}s` : `${timeLeft}s`;
    }
    if (this.rageFillEl) this.rageFillEl.style.width = landlordRage + '%';

    if (this.bonusHudEl && extra.bonusLabel) {
      const bonusIcon = extra.bonusFailed ? '✕' : '✓';
      const bonusColor = extra.bonusFailed ? '#dc2626' : '#16a34a';
      this.bonusHudEl.title = `${extra.bonusLabel} (Par ${extra.parTime}s)`;
      this.bonusHudEl.innerHTML = `<span style="color:${bonusColor}; font-weight:900;">🎯 ${bonusIcon}</span> <span>${extra.bonusLabel}</span>`;
    }

    if (this.comboHudEl) {
      if ((extra.combo || 0) >= 2 && (extra.comboTimer || 0) > 0) {
        const bonusK = Math.min(4, extra.combo - 1) * 350;
        this.comboHudEl.style.display = 'flex';
        this.comboHudEl.innerHTML = `<span>🔥 x${extra.combo}</span><span style="margin-left:6px; opacity:0.9;">+${bonusK}k</span><span style="margin-left:6px; font-size:11px; opacity:0.8;">${extra.comboTimer.toFixed(1)}s</span>`;
      } else {
        this.comboHudEl.style.display = 'none';
      }
    }

    if (this.p1HudEl) {
      this.p1HudEl.style.display = is2PMode ? 'flex' : 'none';
    }
    if (this.p1StatusEl && p1 && is2PMode) {
      if (p1.stunTimer > 0) this.p1StatusEl.innerText = '💫';
      else if (p1.holdingItem) this.p1StatusEl.innerText = '📦 ' + p1.holdingItem.name;
      else this.p1StatusEl.innerText = t('status_idle');
    }

    if (this.p2HudEl && this.p2StatusEl) {
      if (is2PMode) {
        this.p2HudEl.style.display = 'flex';
        if (p2) {
          if (p2.stunTimer > 0) this.p2StatusEl.innerText = '💫';
          else if (p2.holdingItem) this.p2StatusEl.innerText = '📦 ' + p2.holdingItem.name;
          else this.p2StatusEl.innerText = t('status_idle');
        }
      } else {
        this.p2HudEl.style.display = 'none';
      }
    }
  }

  addFeedPill(text, type = 'normal') {
    if (!this.deliveryFeedEl) return;
    const pill = document.createElement('div');
    pill.className = 'feed-pill ' + type;
    pill.innerHTML = text;
    this.deliveryFeedEl.appendChild(pill);
    if (this.deliveryFeedEl.children.length > 3) {
      this.deliveryFeedEl.removeChild(this.deliveryFeedEl.children[0]);
    }
    setTimeout(() => {
      if (pill.parentNode) pill.parentNode.removeChild(pill);
    }, 2200);
  }

  showGameOver(score, itemsDelivered, targetItems, landlordRage, options = {}) {
    if (!this.gameoverOverlayEl) return;
    if (this.pauseOverlayEl) this.pauseOverlayEl.style.display = 'none';

    if (this.endTitleEl && this.endSubEl) {
      if (landlordRage >= 100) {
        this.endTitleEl.innerText = t('end_anger_title');
        this.endSubEl.innerText = t('end_anger_sub');
      } else if (itemsDelivered >= targetItems) {
        this.endTitleEl.innerText = t('end_win_title');
        this.endSubEl.innerText = t('end_win_sub');
      } else {
        this.endTitleEl.innerText = t('end_timeout_title');
        this.endSubEl.innerText = t('end_timeout_sub');
      }
    }

    // 3-Star & Bonus Breakdown
    const stars = Number.isFinite(options.stars) ? options.stars : (itemsDelivered >= targetItems ? 1 : 0);
    if (this.finalStarsEl) {
      let html = '';
      for (let i = 1; i <= 3; i++) {
        html += `<span class="end-star ${i <= stars ? 'lit' : 'dim'}">★</span>`;
      }
      this.finalStarsEl.innerHTML = html;
    }

    if (this.finalStarBreakdownEl && options.starBreakdown && options.parTime) {
      const sb = options.starBreakdown;
      const bonusLabel = options.bonusLabel || '';
      const row = (ok, label) => `<div class="star-row ${ok ? 'ok' : 'miss'}">${ok ? '⭐' : '✖'} ${label}</div>`;
      this.finalStarBreakdownEl.innerHTML =
        row(sb.clear, t('end_star_clear')) +
        row(sb.par, t('end_star_par', { par: options.parTime })) +
        row(sb.bonus, t('end_star_bonus', { bonus: bonusLabel }));
    }

    if (this.finalRecordBadgeEl) {
      this.finalRecordBadgeEl.style.display = options.isNewRecord ? 'inline-block' : 'none';
      this.finalRecordBadgeEl.innerText = t('end_new_record');
    }

    if (this.finalEarningsEl) this.finalEarningsEl.innerText = score.toLocaleString('vi-VN') + ' VNĐ';
    if (this.finalStatsEl) {
      const timeRow = Number.isFinite(options.elapsedSeconds)
        ? `<br>${t('end_stats_time')}: <b>${options.elapsedSeconds}s${options.unlimitedTime ? ' (♾️)' : ''}</b>`
        : '';
      this.finalStatsEl.innerHTML = `
        ${t('end_stats_loaded')}: <b>${itemsDelivered} / ${targetItems}</b><br>
        ${t('end_stats_rage')}: <b>${landlordRage}%</b>${timeRow}
      `;
    }

    let rank = '', quote = '';
    if (landlordRage >= 100) {
      rank = t('rank_disaster');
      quote = t('quote_disaster');
    } else if (itemsDelivered >= targetItems) {
      rank = t('rank_royal');
      quote = t('quote_royal');
    } else if (itemsDelivered >= Math.floor(targetItems * 0.6)) {
      rank = t('rank_pro');
      quote = t('quote_pro');
    } else {
      rank = t('rank_rookie');
      quote = t('quote_rookie');
    }

    if (this.finalRankEl) this.finalRankEl.innerText = rank;
    if (this.finalQuoteEl) this.finalQuoteEl.innerText = quote;
    this.containerEl?.classList?.remove('is-menu');
    this.containerEl?.classList?.add('is-gameover');
    this.gameoverOverlayEl.style.display = 'flex';
  }

  hideStartMenu() {
    this.containerEl?.classList?.remove('is-menu');
    this.containerEl?.classList?.remove('is-gameover');
    if (this.startOverlayEl) this.startOverlayEl.style.display = 'none';
    if (this.gameoverOverlayEl) this.gameoverOverlayEl.style.display = 'none';
    if (this.pauseOverlayEl) this.pauseOverlayEl.style.display = 'none';
  }

  showStartMenu() {
    this.containerEl?.classList?.add('is-menu');
    this.containerEl?.classList?.remove('is-gameover');
    if (this.startOverlayEl) this.startOverlayEl.style.display = 'flex';
    if (this.gameoverOverlayEl) this.gameoverOverlayEl.style.display = 'none';
    if (this.pauseOverlayEl) this.pauseOverlayEl.style.display = 'none';
  }

  setPauseModalVisible(visible) {
    if (this.pauseOverlayEl) this.pauseOverlayEl.style.display = visible ? 'flex' : 'none';
  }
}

