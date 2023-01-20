<template>
  <div
    class="ma-4 flipcard"
    v-on:click="card.isflipped = !card.isflipped"
    v-bind:class="{ isflipped: card.isflipped, small: size == 'small', large: size == 'large' }"
  >
    <div class="card-container">
      <div class="cardface-front">
        <p class="text-h6 text-black">{{ card.question }}</p>
        <p class="text-body-1 text-uppercase text-blue-lighten-2 text-center">Question</p>
      </div>
      <div class="cardface-back">
        <p class="text-body-1 font-weight-medium text-black">{{ card.answer }}</p>
        <p class="text-body-1 text-uppercase text-green-lighten-2 text-center">Answer</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['card', 'size'],
}
</script>

<style scoped>
  .flipcard {
    background-color: transparent;
    perspective: 1000px;
    cursor: pointer;
    
  }
  .small {
    width: 220px;
    height: 264px;
  }
  .large {
    width: 270px;
    height: 324px;
  }
  .card-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;;
  }
  .cardface-back, .cardface-front  {
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 12px;
    backface-visibility: hidden;
    background-color: white;
  }
  .isflipped .card-container{
    transform: rotateY(180deg);
  }
  .cardface-back {
    transform: rotateY(180deg);
  }
</style>