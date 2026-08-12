<template>
  <div class="skeleton-card border-divider border-b py-4">
    <div class="product-area flex min-w-0 items-center gap-4">
      <div class="h-20 w-20 shrink-0 animate-pulse rounded-md bg-gray-200"></div>

      <div class="min-w-0 flex-1 space-y-2">
        <div class="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div class="h-3 w-full animate-pulse rounded bg-gray-200"></div>
        <div class="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>

    <div class="price-value flex justify-end lg:justify-center">
      <div class="h-4 w-14 animate-pulse rounded bg-gray-200"></div>
    </div>

    <div class="qty-value flex justify-end lg:justify-center">
      <div class="h-9 w-32 animate-pulse rounded-lg bg-gray-200 lg:h-11 lg:w-44"></div>
    </div>

    <div class="total-value flex justify-end lg:justify-center">
      <div class="h-4 w-14 animate-pulse rounded bg-gray-200"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'product product'
    'price-label price-value'
    'qty-label qty-value'
    'total-label total-value';
  row-gap: 0.75rem;
  column-gap: 1rem;
}
.product-area {
  grid-area: product;
}
.price-value {
  grid-area: price-value;
  align-self: center;
}
.qty-value {
  grid-area: qty-value;
}
.total-value {
  grid-area: total-value;
  align-self: center;
}

@media (min-width: 768px) and (max-width: 1023.98px) {
  .skeleton-card {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'product product product'
      'price-label qty-label total-label'
      'price-value qty-value total-value';
    column-gap: 2rem;
    row-gap: 0.5rem;
  }
  .price-value,
  .qty-value,
  .total-value {
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .skeleton-card {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    grid-template-areas: 'product price-value qty-value total-value';
    align-items: center;
    column-gap: 2rem;
    row-gap: 0;
  }
}
</style>
