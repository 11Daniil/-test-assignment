<template>
  <footer id="contacts" class="site-footer">
    <div class="site-footer__inner container">
      <nav class="site-footer__nav" aria-label="Навигация в подвале">
        <a href="#catalog">Каталог</a>
        <a id="delivery" href="#delivery">Доставка</a>
        <a id="payment" href="#payment">Оплата</a>
        <a href="#contacts">Контакты</a>
        <a id="about" href="#about">О компании</a>
      </nav>

      <div class="site-footer__contacts">
        <a class="site-footer__contact" href="tel:+78125555555">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M7.2 3.5 10 8 7.8 9.8c1 2.2 2.8 4 5 5l1.9-2.2 4.4 2.8-.8 3.1c-.2.8-1 1.3-1.8 1.3C9.6 19.3 4.1 13.8 3.7 6.9c-.1-.8.5-1.6 1.3-1.8l2.2-.6Z"
            />
          </svg>
          <span>+7 (812) 555-55-55</span>
        </a>

        <address class="site-footer__contact">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 21s6-6.2 6-12A6 6 0 0 0 6 9c0 5.8 6 12 6 12Z" />
            <circle cx="12" cy="9" r="2" />
          </svg>
          <span>г. Санкт-Петербург, ул. Ефимова, 3</span>
        </address>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter',
};
</script>

<style scoped>
.site-footer {
  flex: 0 0 96px;
  background: var(--color-surface-muted);
}

.site-footer__inner {
  display: flex;
  height: 96px;
  align-items: center;
  padding-left: 96px;
}

.site-footer__nav {
  display: flex;
  align-items: center;
  gap: 48px;
  white-space: nowrap;
}

.site-footer a {
  text-decoration: none;
}

.site-footer__nav a {
  font-size: 14px;
  line-height: 21px;
}

.site-footer__nav a:hover,
.site-footer__nav a:focus-visible,
.site-footer__contact:hover,
.site-footer__contact:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.site-footer__contacts {
  display: flex;
  align-items: center;
  gap: 48px;
  margin-left: auto;
}

.site-footer__contact {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  white-space: nowrap;
}

.site-footer__contact svg {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

@media (max-width: 1279px) {
  .site-footer__inner {
    padding-left: 0;
  }

  .site-footer__nav {
    gap: 22px;
  }

  .site-footer__contacts {
    gap: 20px;
  }
}

@media (max-width: 1020px) {
  .site-footer {
    flex-basis: auto;
  }

  .site-footer__inner {
    height: auto;
    min-height: 132px;
    flex-wrap: wrap;
    gap: 22px 32px;
    padding-top: 24px;
    padding-bottom: 24px;
  }

  .site-footer__nav {
    width: 100%;
    justify-content: space-between;
  }

  .site-footer__contacts {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }
}

@media (max-width: 639px) {
  .site-footer__inner {
    display: block;
    padding-top: 28px;
    padding-bottom: 28px;
  }

  .site-footer__nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 24px;
  }

  .site-footer__contacts {
    display: grid;
    gap: 14px;
    margin-top: 26px;
  }

  .site-footer__contact {
    white-space: normal;
  }
}
</style>
