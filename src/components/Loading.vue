<template>
  <div class="loading">
    <span></span>
  </div>
</template>

<script>
/**
 * This component creates the loading spinner component of the app
 * @returns a component with loading symbol when the invoice is submitted or updated
 */
export default {
  name: "loading",
};
</script>

<style lang="scss">
.loading {
  top: 0;
  left: 0;
  z-index: 101;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  span {
    display: block;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border: 3px solid transparent;
    border-top-color: #fff;
    border-bottom-color: #fff;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>
