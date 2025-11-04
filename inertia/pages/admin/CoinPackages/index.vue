<script setup lang="ts">
  interface coin_package {
    name: string,
    coinAmount: number,
    price: number,
    bonusCoin: number
  }

  interface CoinPackageProps {
    coin: coin_package[]
  }

  const props = defineProps<CoinPackageProps>()

  //const { name, coinAmount, price, bonusCoin } = defineProps<Coin>()
</script>

<template>
  <div v-for="(coin, index) in props.coin"
    :key="index"
    >
    {{ coin.name }}
  </div>
</template>
