<script setup></script>

<template>
  <header class="header container">
    <div class="header__wrapper">
      <span class="header__info">Каталог</span>

      <a class="header__logo" href="#">
        <img
          src="/img/svg/logo-moire.svg"
          alt="Логотип интернет магазина Moire"
          width="116"
          height="34"
        />
      </a>

      <a class="header__tel" href="tel:8 800 600 90 09"> 8 800 600 90 09 </a>

      <a class="header__cart" href="cart.html" aria-label="Корзина с товарами">
        <svg width="19" height="24">
          <use xlink:href="#icon-cart"></use>
        </svg>
        <span class="header__count" aria-label="Количество товаров">3</span>
      </a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '../styles/variables';
.header {
  background-color: $bg-second;

  &__wrapper {
    display: grid;
    grid-template-columns: 380px 1fr 300px 25px;
    grid-column-gap: 40px;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 23px;
    padding-bottom: 23px;
    border-bottom: 1px solid #e9e9e9;
  }

  &__info {
    font-size: 12px;
    text-transform: uppercase;
  }

  &__logo {
    display: block;
    width: 190px;
    height: 33px;
    margin: 0 auto;
  }

  &__tel {
    margin-left: auto;

    font-size: 14px;
    color: #000;
  }

  &__cart {
    position: relative;
    height: 27px;
  }

  &__count {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: $color-primary;
    padding: 3px;
    min-width: 13px;
    height: 13px;
    border-radius: 50%;

    font-size: 7px;
    line-height: 1;
    font-weight: 500;
    color: #fff;
    text-align: center;
  }
}
</style>
