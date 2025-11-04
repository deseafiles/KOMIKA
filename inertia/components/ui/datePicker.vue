<script>
</script>

<template>
<!-- Datepicker -->
<div class="hs-datepicker py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-600 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:border-blue-500 dark:focus:ring-neutral-500" data-hs-datepicker='{
    "inputMode": false,
    "type": "multiple",
    "displayDatesOutside": false,
    "selectionDatesMode": "multiple-ranged",
    "displayMonthsCount": 2,
    "dateMax": "2050-12-31",
    "layouts": {
      "multiple": "<div class=\"relative flex flex-col\"><div class=\"absolute top-2 start-2\"><#CustomArrowPrev /></div><div class=\"absolute top-2 end-2\"><#CustomArrowNext /></div><div class=\"sm:flex\" data-vc=\"grid\"><#Multiple><div class=\"p-3 space-y-0.5 --single-month\" data-vc=\"column\"><div class=\"pb-3\" data-vc=\"header\"><div class=\"flex justify-center items-center gap-x-1\" data-vc-header=\"content\"><#CustomMonth /><span class=\"text-gray-800 dark:text-neutral-200\">/</span><#CustomYear /></div></div><div data-vc=\"wrapper\"><div data-vc=\"content\"><#Week /><#Dates /></div></div></div><#/Multiple></div></div><#CustomTime />"
    },
    "mode": "custom-select",
    "inputModeOptions": {
      "itemsSeparator": " / "
    },
    "templates": {
      "arrowPrev": "<button data-vc-arrow=\"prev\"><svg class=\"shrink-0 size-4\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15 18-6-6 6-6\"></path></svg></button>",
      "arrowNext": "<button data-vc-arrow=\"next\"><svg class=\"shrink-0 size-4\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m9 18 6-6-6-6\"></path></svg></button>"
    }
  }'></div>
<!-- End Datepicker -->
</template>
