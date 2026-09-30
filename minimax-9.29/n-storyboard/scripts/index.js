(function(){var s=document.createElement("style");s.textContent="/*! tailwindcss v4.2.4 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;--color-red-500:oklch(63.7% .237 25.331);--color-blue-500:oklch(62.3% .214 259.815);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-500:oklch(55.1% .027 264.364);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-md:28rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height: 1.5 ;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--leading-relaxed:1.625;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-4xl:2rem;--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--animate-bounce:bounce 1s infinite;--blur-sm:8px;--blur-xl:24px;--aspect-video:16 / 9;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.sticky{position:sticky}.inset-0{inset:calc(var(--spacing) * 0)}.start{inset-inline-start:var(--spacing)}.top-0{top:calc(var(--spacing) * 0)}.top-2{top:calc(var(--spacing) * 2)}.right-0{right:calc(var(--spacing) * 0)}.right-2{right:calc(var(--spacing) * 2)}.bottom-0{bottom:calc(var(--spacing) * 0)}.bottom-4{bottom:calc(var(--spacing) * 4)}.left-1{left:calc(var(--spacing) * 1)}.left-1\\/2{left:50%}.left-2{left:calc(var(--spacing) * 2)}.z-50{z-index:50}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.my-4{margin-block:calc(var(--spacing) * 4)}.mt-auto{margin-top:auto}.ml-auto{margin-left:auto}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-flex{display:inline-flex}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:var(--aspect-video)}.size-3{width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.size-3\\.5{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.h-1{height:calc(var(--spacing) * 1)}.h-3{height:calc(var(--spacing) * 3)}.h-3\\.5{height:calc(var(--spacing) * 3.5)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-7{height:calc(var(--spacing) * 7)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-16{height:calc(var(--spacing) * 16)}.h-20{height:calc(var(--spacing) * 20)}.h-64{height:calc(var(--spacing) * 64)}.h-\\[44px\\]{height:44px}.h-\\[60px\\]{height:60px}.h-\\[160px\\]{height:160px}.h-\\[200px\\]{height:200px}.h-\\[225px\\]{height:225px}.h-\\[600px\\]{height:600px}.h-\\[var\\(--radix-select-trigger-height\\)\\]{height:var(--radix-select-trigger-height)}.h-full{height:100%}.h-px{height:1px}.max-h-\\(--radix-select-content-available-height\\){max-height:var(--radix-select-content-available-height)}.max-h-\\[480px\\]{max-height:480px}.max-h-full{max-height:100%}.min-h-0{min-height:calc(var(--spacing) * 0)}.min-h-16{min-height:calc(var(--spacing) * 16)}.min-h-20{min-height:calc(var(--spacing) * 20)}.min-h-\\[100px\\]{min-height:100px}.min-h-\\[120px\\]{min-height:120px}.w-3{width:calc(var(--spacing) * 3)}.w-3\\.5{width:calc(var(--spacing) * 3.5)}.w-4{width:calc(var(--spacing) * 4)}.w-5{width:calc(var(--spacing) * 5)}.w-6{width:calc(var(--spacing) * 6)}.w-7{width:calc(var(--spacing) * 7)}.w-8{width:calc(var(--spacing) * 8)}.w-16{width:calc(var(--spacing) * 16)}.w-20{width:calc(var(--spacing) * 20)}.w-24{width:calc(var(--spacing) * 24)}.w-\\[60px\\]{width:60px}.w-\\[240px\\]{width:240px}.w-\\[280px\\]{width:280px}.w-\\[360px\\]{width:360px}.w-\\[400px\\]{width:400px}.w-full{width:100%}.w-px{width:1px}.max-w-\\[520px\\]{max-width:520px}.max-w-full{max-width:100%}.max-w-md{max-width:var(--container-md)}.min-w-32{min-width:calc(var(--spacing) * 32)}.min-w-\\[var\\(--radix-select-trigger-width\\)\\]{min-width:var(--radix-select-trigger-width)}.flex-1{flex:1}.shrink-0{flex-shrink:0}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x) var(--tw-translate-y)}.-rotate-90{rotate:-90deg}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.animate-bounce{animation:var(--animate-bounce)}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.resize{resize:both}.resize-none{resize:none}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-baseline{align-items:baseline}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-1{gap:calc(var(--spacing) * 1)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-5{gap:calc(var(--spacing) * 5)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-7{gap:calc(var(--spacing) * 7)}.gap-\\[2px\\]{gap:2px}.gap-\\[30px\\]{gap:30px}.gap-px{gap:1px}.gap-x-2{column-gap:calc(var(--spacing) * 2)}.gap-y-3{row-gap:calc(var(--spacing) * 3)}.self-stretch{align-self:stretch}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-3xl{border-radius:var(--radius-3xl)}.rounded-4xl{border-radius:var(--radius-4xl)}.rounded-\\[4px\\]{border-radius:4px}.rounded-\\[6px\\]{border-radius:6px}.rounded-\\[10px\\]{border-radius:10px}.rounded-\\[12px\\]{border-radius:12px}.rounded-\\[20px\\]{border-radius:20px}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-none{border-radius:0}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-b-2{border-bottom-style:var(--tw-border-style);border-bottom-width:2px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-border{border-color:var(--border)}.border-foreground{border-color:var(--foreground)}.border-gray-200{border-color:var(--color-gray-200)}.border-input{border-color:var(--input)}.border-ring{border-color:var(--ring)}.border-sidebar-border{border-color:var(--sidebar-border)}.bg-\\[\\#7657FF\\]{background-color:#7657ff}.bg-\\[\\#xxx\\]{background-color:#xxx}.bg-\\[var\\(--brand-accent\\)\\]{background-color:var(--brand-accent)}.bg-accent{background-color:var(--accent)}.bg-background{background-color:var(--background)}.bg-black{background-color:var(--color-black)}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab,red,red)){.bg-black\\/50{background-color:color-mix(in oklab,var(--color-black) 50%,transparent)}}.bg-blue-500{background-color:var(--color-blue-500)}.bg-border{background-color:var(--border)}.bg-card{background-color:var(--card)}.bg-destructive,.bg-destructive\\/10{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.bg-destructive\\/10{background-color:color-mix(in oklab,var(--destructive) 10%,transparent)}}.bg-destructive\\/15{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.bg-destructive\\/15{background-color:color-mix(in oklab,var(--destructive) 15%,transparent)}}.bg-foreground,.bg-foreground\\/80{background-color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.bg-foreground\\/80{background-color:color-mix(in oklab,var(--foreground) 80%,transparent)}}.bg-gray-100{background-color:var(--color-gray-100)}.bg-input{background-color:var(--input)}.bg-muted,.bg-muted\\/30{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/30{background-color:color-mix(in oklab,var(--muted) 30%,transparent)}}.bg-popover{background-color:var(--popover)}.bg-primary,.bg-primary\\/90{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/90{background-color:color-mix(in oklab,var(--primary) 90%,transparent)}}.bg-red-500{background-color:var(--color-red-500)}.bg-secondary,.bg-secondary\\/80{background-color:var(--secondary)}@supports (color:color-mix(in lab,red,red)){.bg-secondary\\/80{background-color:color-mix(in oklab,var(--secondary) 80%,transparent)}}.bg-sidebar{background-color:var(--sidebar)}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.\\!fill-none{fill:none!important}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-1{padding:calc(var(--spacing) * 1)}.p-2{padding:calc(var(--spacing) * 2)}.p-3{padding:calc(var(--spacing) * 3)}.p-4{padding:calc(var(--spacing) * 4)}.p-\\[2px\\]{padding:2px}.p-px{padding:1px}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-8{padding-inline:calc(var(--spacing) * 8)}.px-\\[10px\\]{padding-inline:10px}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:calc(var(--spacing) * 1)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-4{padding-block:calc(var(--spacing) * 4)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pt-3{padding-top:calc(var(--spacing) * 3)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pr-2{padding-right:calc(var(--spacing) * 2)}.pb-1{padding-bottom:calc(var(--spacing) * 1)}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-4{padding-bottom:calc(var(--spacing) * 4)}.pb-11{padding-bottom:calc(var(--spacing) * 11)}.pl-3{padding-left:calc(var(--spacing) * 3)}.pl-6{padding-left:calc(var(--spacing) * 6)}.text-center{text-align:center}.font-\\[\\'Outfit\\'\\]{font-family:Outfit}.font-sans{font-family:var(--font-sans)}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-xs\\/relaxed{font-size:var(--text-xs);line-height:var(--leading-relaxed)}.text-\\[11px\\]{font-size:11px}.text-\\[32px\\]{font-size:32px}.leading-5{--tw-leading:calc(var(--spacing) * 5);line-height:calc(var(--spacing) * 5)}.leading-8{--tw-leading:calc(var(--spacing) * 8);line-height:calc(var(--spacing) * 8)}.leading-\\[14px\\]{--tw-leading:14px;line-height:14px}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[0\\.44px\\]{--tw-tracking:.44px;letter-spacing:.44px}.tracking-\\[0\\.56px\\]{--tw-tracking:.56px;letter-spacing:.56px}.tracking-\\[1\\.28px\\]{--tw-tracking:1.28px;letter-spacing:1.28px}.whitespace-nowrap{white-space:nowrap}.text-\\[\\#FF6B6B\\]{color:#ff6b6b}.text-\\[\\#xxx\\]{color:#xxx}.text-accent-foreground{color:var(--accent-foreground)}.text-background{color:var(--background)}.text-card-foreground{color:var(--card-foreground)}.text-destructive{color:var(--destructive)}.text-foreground{color:var(--foreground)}.text-gray-500{color:var(--color-gray-500)}.text-muted-foreground{color:var(--muted-foreground)}.text-popover-foreground{color:var(--popover-foreground)}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-red-500{color:var(--color-red-500)}.text-secondary-foreground{color:var(--secondary-foreground)}.text-sidebar-foreground{color:var(--sidebar-foreground)}.text-white{color:var(--color-white)}.underline{text-decoration-line:underline}.underline-offset-4{text-underline-offset:4px}.opacity-0{opacity:0}.opacity-40{opacity:.4}.opacity-50{opacity:.5}.opacity-100{opacity:1}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a), 0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-none{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-0{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-1{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-2{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-\\[3px\\]{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-foreground\\/10{--tw-ring-color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.ring-foreground\\/10{--tw-ring-color:color-mix(in oklab, var(--foreground) 10%, transparent)}}.ring-ring,.ring-ring\\/50{--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab,red,red)){.ring-ring\\/50{--tw-ring-color:color-mix(in oklab, var(--ring) 50%, transparent)}}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-blur-sm{--tw-backdrop-blur:blur(var(--blur-sm));-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-blur-xl{--tw-backdrop-blur:blur(var(--blur-xl));-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[width\\]{transition-property:width;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-80{--tw-duration:80ms;transition-duration:80ms}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}@media(hover:hover){.group-hover\\:flex:is(:where(.group):hover *){display:flex}.group-hover\\:opacity-90:is(:where(.group):hover *){opacity:.9}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}}.placeholder\\:text-muted-foreground::placeholder{color:var(--muted-foreground)}@media(hover:hover){.hover\\:bg-destructive\\/15:hover{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-destructive\\/15:hover{background-color:color-mix(in oklab,var(--destructive) 15%,transparent)}}.hover\\:bg-muted:hover{background-color:var(--muted)}.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--primary) 90%,transparent)}}.hover\\:bg-secondary\\/80:hover{background-color:var(--secondary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-secondary\\/80:hover{background-color:color-mix(in oklab,var(--secondary) 80%,transparent)}}.hover\\:text-foreground:hover{color:var(--foreground)}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-80:hover{opacity:.8}.hover\\:opacity-90:hover{opacity:.9}}.focus\\:bg-muted:focus{background-color:var(--muted)}.focus\\:text-foreground:focus{color:var(--foreground)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.focus-visible\\:border-ring:focus-visible{border-color:var(--ring)}.focus-visible\\:opacity-100:focus-visible{opacity:1}.focus-visible\\:ring-1:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-ring:focus-visible,.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab,red,red)){.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:color-mix(in oklab, var(--ring) 50%, transparent)}}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.active\\:opacity-80:active{opacity:.8}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:opacity-50:disabled{opacity:.5}.aria-invalid\\:border-destructive[aria-invalid=true]{border-color:var(--destructive)}.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:color-mix(in oklab, var(--destructive) 20%, transparent)}}.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{pointer-events:none}.data-\\[disabled\\]\\:opacity-50[data-disabled]{opacity:.5}.data-\\[side\\=bottom\\]\\:translate-y-1[data-side=bottom]{--tw-translate-y:calc(var(--spacing) * 1);translate:var(--tw-translate-x) var(--tw-translate-y)}.data-\\[side\\=top\\]\\:-translate-y-1[data-side=top]{--tw-translate-y:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:size-3\\.5 svg{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.\\[\\&_svg\\]\\:size-4 svg{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4 svg:not([class*=size-]){width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.\\[\\&\\>span\\]\\:line-clamp-1>span{-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.\\[\\&\\>span\\]\\:text-left>span{text-align:left}}@property --tw-translate-x{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-y{syntax:\"*\";inherits:false;initial-value:0}@property --tw-translate-z{syntax:\"*\";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:\"*\";inherits:false}@property --tw-rotate-y{syntax:\"*\";inherits:false}@property --tw-rotate-z{syntax:\"*\";inherits:false}@property --tw-skew-x{syntax:\"*\";inherits:false}@property --tw-skew-y{syntax:\"*\";inherits:false}@property --tw-border-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-leading{syntax:\"*\";inherits:false}@property --tw-font-weight{syntax:\"*\";inherits:false}@property --tw-tracking{syntax:\"*\";inherits:false}@property --tw-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:\"*\";inherits:false}@property --tw-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:\"*\";inherits:false}@property --tw-inset-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:\"*\";inherits:false}@property --tw-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:\"*\";inherits:false}@property --tw-inset-ring-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:\"*\";inherits:false}@property --tw-ring-offset-width{syntax:\"<length>\";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:\"*\";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:\"*\";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:\"*\";inherits:false;initial-value:solid}@property --tw-blur{syntax:\"*\";inherits:false}@property --tw-brightness{syntax:\"*\";inherits:false}@property --tw-contrast{syntax:\"*\";inherits:false}@property --tw-grayscale{syntax:\"*\";inherits:false}@property --tw-hue-rotate{syntax:\"*\";inherits:false}@property --tw-invert{syntax:\"*\";inherits:false}@property --tw-opacity{syntax:\"*\";inherits:false}@property --tw-saturate{syntax:\"*\";inherits:false}@property --tw-sepia{syntax:\"*\";inherits:false}@property --tw-drop-shadow{syntax:\"*\";inherits:false}@property --tw-drop-shadow-color{syntax:\"*\";inherits:false}@property --tw-drop-shadow-alpha{syntax:\"<percentage>\";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:\"*\";inherits:false}@property --tw-backdrop-blur{syntax:\"*\";inherits:false}@property --tw-backdrop-brightness{syntax:\"*\";inherits:false}@property --tw-backdrop-contrast{syntax:\"*\";inherits:false}@property --tw-backdrop-grayscale{syntax:\"*\";inherits:false}@property --tw-backdrop-hue-rotate{syntax:\"*\";inherits:false}@property --tw-backdrop-invert{syntax:\"*\";inherits:false}@property --tw-backdrop-opacity{syntax:\"*\";inherits:false}@property --tw-backdrop-saturate{syntax:\"*\";inherits:false}@property --tw-backdrop-sepia{syntax:\"*\";inherits:false}@property --tw-duration{syntax:\"*\";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,to{animation-timing-function:cubic-bezier(.8,0,1,1);transform:translateY(-25%)}50%{animation-timing-function:cubic-bezier(0,0,.2,1);transform:none}}\n";document.head.appendChild(s)})();
function Ab(a, c) {
  for (var o = 0; o < c.length; o++) {
    const r = c[o];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const s in r)
        if (s !== "default" && !(s in a)) {
          const d = Object.getOwnPropertyDescriptor(r, s);
          d && Object.defineProperty(a, s, d.get ? d : {
            enumerable: !0,
            get: () => r[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
function bv(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var jr = { exports: {} }, Si = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Oh;
function Tb() {
  if (Oh) return Si;
  Oh = 1;
  var a = Symbol.for("react.transitional.element"), c = Symbol.for("react.fragment");
  function o(r, s, d) {
    var m = null;
    if (d !== void 0 && (m = "" + d), s.key !== void 0 && (m = "" + s.key), "key" in s) {
      d = {};
      for (var v in s)
        v !== "key" && (d[v] = s[v]);
    } else d = s;
    return s = d.ref, {
      $$typeof: a,
      type: r,
      key: m,
      ref: s !== void 0 ? s : null,
      props: d
    };
  }
  return Si.Fragment = c, Si.jsx = o, Si.jsxs = o, Si;
}
var _h;
function wb() {
  return _h || (_h = 1, jr.exports = Tb()), jr.exports;
}
var L = wb(), Hr = { exports: {} }, xi = {}, Lr = { exports: {} }, Br = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rh;
function Cb() {
  return Rh || (Rh = 1, (function(a) {
    function c(V, B) {
      var G = V.length;
      V.push(B);
      e: for (; 0 < G; ) {
        var le = G - 1 >>> 1, W = V[le];
        if (0 < s(W, B))
          V[le] = B, V[G] = W, G = le;
        else break e;
      }
    }
    function o(V) {
      return V.length === 0 ? null : V[0];
    }
    function r(V) {
      if (V.length === 0) return null;
      var B = V[0], G = V.pop();
      if (G !== B) {
        V[0] = G;
        e: for (var le = 0, W = V.length, Be = W >>> 1; le < Be; ) {
          var T = 2 * (le + 1) - 1, Q = V[T], $ = T + 1, P = V[$];
          if (0 > s(Q, G))
            $ < W && 0 > s(P, Q) ? (V[le] = P, V[$] = G, le = $) : (V[le] = Q, V[T] = G, le = T);
          else if ($ < W && 0 > s(P, G))
            V[le] = P, V[$] = G, le = $;
          else break e;
        }
      }
      return B;
    }
    function s(V, B) {
      var G = V.sortIndex - B.sortIndex;
      return G !== 0 ? G : V.id - B.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var d = performance;
      a.unstable_now = function() {
        return d.now();
      };
    } else {
      var m = Date, v = m.now();
      a.unstable_now = function() {
        return m.now() - v;
      };
    }
    var p = [], h = [], b = 1, E = null, A = 3, R = !1, D = !1, S = !1, C = !1, j = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, U = typeof setImmediate < "u" ? setImmediate : null;
    function Y(V) {
      for (var B = o(h); B !== null; ) {
        if (B.callback === null) r(h);
        else if (B.startTime <= V)
          r(h), B.sortIndex = B.expirationTime, c(p, B);
        else break;
        B = o(h);
      }
    }
    function k(V) {
      if (S = !1, Y(V), !D)
        if (o(p) !== null)
          D = !0, I || (I = !0, de());
        else {
          var B = o(h);
          B !== null && pe(k, B.startTime - V);
        }
    }
    var I = !1, J = -1, X = 5, ue = -1;
    function me() {
      return C ? !0 : !(a.unstable_now() - ue < X);
    }
    function be() {
      if (C = !1, I) {
        var V = a.unstable_now();
        ue = V;
        var B = !0;
        try {
          e: {
            D = !1, S && (S = !1, O(J), J = -1), R = !0;
            var G = A;
            try {
              t: {
                for (Y(V), E = o(p); E !== null && !(E.expirationTime > V && me()); ) {
                  var le = E.callback;
                  if (typeof le == "function") {
                    E.callback = null, A = E.priorityLevel;
                    var W = le(
                      E.expirationTime <= V
                    );
                    if (V = a.unstable_now(), typeof W == "function") {
                      E.callback = W, Y(V), B = !0;
                      break t;
                    }
                    E === o(p) && r(p), Y(V);
                  } else r(p);
                  E = o(p);
                }
                if (E !== null) B = !0;
                else {
                  var Be = o(h);
                  Be !== null && pe(
                    k,
                    Be.startTime - V
                  ), B = !1;
                }
              }
              break e;
            } finally {
              E = null, A = G, R = !1;
            }
            B = void 0;
          }
        } finally {
          B ? de() : I = !1;
        }
      }
    }
    var de;
    if (typeof U == "function")
      de = function() {
        U(be);
      };
    else if (typeof MessageChannel < "u") {
      var ve = new MessageChannel(), ge = ve.port2;
      ve.port1.onmessage = be, de = function() {
        ge.postMessage(null);
      };
    } else
      de = function() {
        j(be, 0);
      };
    function pe(V, B) {
      J = j(function() {
        V(a.unstable_now());
      }, B);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(V) {
      V.callback = null;
    }, a.unstable_forceFrameRate = function(V) {
      0 > V || 125 < V ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : X = 0 < V ? Math.floor(1e3 / V) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return A;
    }, a.unstable_next = function(V) {
      switch (A) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = A;
      }
      var G = A;
      A = B;
      try {
        return V();
      } finally {
        A = G;
      }
    }, a.unstable_requestPaint = function() {
      C = !0;
    }, a.unstable_runWithPriority = function(V, B) {
      switch (V) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          V = 3;
      }
      var G = A;
      A = V;
      try {
        return B();
      } finally {
        A = G;
      }
    }, a.unstable_scheduleCallback = function(V, B, G) {
      var le = a.unstable_now();
      switch (typeof G == "object" && G !== null ? (G = G.delay, G = typeof G == "number" && 0 < G ? le + G : le) : G = le, V) {
        case 1:
          var W = -1;
          break;
        case 2:
          W = 250;
          break;
        case 5:
          W = 1073741823;
          break;
        case 4:
          W = 1e4;
          break;
        default:
          W = 5e3;
      }
      return W = G + W, V = {
        id: b++,
        callback: B,
        priorityLevel: V,
        startTime: G,
        expirationTime: W,
        sortIndex: -1
      }, G > le ? (V.sortIndex = G, c(h, V), o(p) === null && V === o(h) && (S ? (O(J), J = -1) : S = !0, pe(k, G - le))) : (V.sortIndex = W, c(p, V), D || R || (D = !0, I || (I = !0, de()))), V;
    }, a.unstable_shouldYield = me, a.unstable_wrapCallback = function(V) {
      var B = A;
      return function() {
        var G = A;
        A = B;
        try {
          return V.apply(this, arguments);
        } finally {
          A = G;
        }
      };
    };
  })(Br)), Br;
}
var zh;
function Ob() {
  return zh || (zh = 1, Lr.exports = Cb()), Lr.exports;
}
var Yr = { exports: {} }, he = {}, Mh;
function _b() {
  if (Mh) return he;
  Mh = 1;
  var a = { env: { NODE_ENV: "production" }, browser: !0, version: "" };
  /**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var c = Symbol.for("react.transitional.element"), o = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), v = Symbol.for("react.context"), p = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), A = Symbol.for("react.activity"), R = Symbol.iterator;
  function D(T) {
    return T === null || typeof T != "object" ? null : (T = R && T[R] || T["@@iterator"], typeof T == "function" ? T : null);
  }
  var S = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, C = Object.assign, j = {};
  function O(T, Q, $) {
    this.props = T, this.context = Q, this.refs = j, this.updater = $ || S;
  }
  O.prototype.isReactComponent = {}, O.prototype.setState = function(T, Q) {
    if (typeof T != "object" && typeof T != "function" && T != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, T, Q, "setState");
  }, O.prototype.forceUpdate = function(T) {
    this.updater.enqueueForceUpdate(this, T, "forceUpdate");
  };
  function U() {
  }
  U.prototype = O.prototype;
  function Y(T, Q, $) {
    this.props = T, this.context = Q, this.refs = j, this.updater = $ || S;
  }
  var k = Y.prototype = new U();
  k.constructor = Y, C(k, O.prototype), k.isPureReactComponent = !0;
  var I = Array.isArray;
  function J() {
  }
  var X = { H: null, A: null, T: null, S: null }, ue = Object.prototype.hasOwnProperty;
  function me(T, Q, $) {
    var P = $.ref;
    return {
      $$typeof: c,
      type: T,
      key: Q,
      ref: P !== void 0 ? P : null,
      props: $
    };
  }
  function be(T, Q) {
    return me(T.type, Q, T.props);
  }
  function de(T) {
    return typeof T == "object" && T !== null && T.$$typeof === c;
  }
  function ve(T) {
    var Q = { "=": "=0", ":": "=2" };
    return "$" + T.replace(/[=:]/g, function($) {
      return Q[$];
    });
  }
  var ge = /\/+/g;
  function pe(T, Q) {
    return typeof T == "object" && T !== null && T.key != null ? ve("" + T.key) : Q.toString(36);
  }
  function V(T) {
    switch (T.status) {
      case "fulfilled":
        return T.value;
      case "rejected":
        throw T.reason;
      default:
        switch (typeof T.status == "string" ? T.then(J, J) : (T.status = "pending", T.then(
          function(Q) {
            T.status === "pending" && (T.status = "fulfilled", T.value = Q);
          },
          function(Q) {
            T.status === "pending" && (T.status = "rejected", T.reason = Q);
          }
        )), T.status) {
          case "fulfilled":
            return T.value;
          case "rejected":
            throw T.reason;
        }
    }
    throw T;
  }
  function B(T, Q, $, P, ae) {
    var F = typeof T;
    (F === "undefined" || F === "boolean") && (T = null);
    var ce = !1;
    if (T === null) ce = !0;
    else
      switch (F) {
        case "bigint":
        case "string":
        case "number":
          ce = !0;
          break;
        case "object":
          switch (T.$$typeof) {
            case c:
            case o:
              ce = !0;
              break;
            case E:
              return ce = T._init, B(
                ce(T._payload),
                Q,
                $,
                P,
                ae
              );
          }
      }
    if (ce)
      return ae = ae(T), ce = P === "" ? "." + pe(T, 0) : P, I(ae) ? ($ = "", ce != null && ($ = ce.replace(ge, "$&/") + "/"), B(ae, Q, $, "", function(xe) {
        return xe;
      })) : ae != null && (de(ae) && (ae = be(
        ae,
        $ + (ae.key == null || T && T.key === ae.key ? "" : ("" + ae.key).replace(
          ge,
          "$&/"
        ) + "/") + ce
      )), Q.push(ae)), 1;
    ce = 0;
    var re = P === "" ? "." : P + ":";
    if (I(T))
      for (var se = 0; se < T.length; se++)
        P = T[se], F = re + pe(P, se), ce += B(
          P,
          Q,
          $,
          F,
          ae
        );
    else if (se = D(T), typeof se == "function")
      for (T = se.call(T), se = 0; !(P = T.next()).done; )
        P = P.value, F = re + pe(P, se++), ce += B(
          P,
          Q,
          $,
          F,
          ae
        );
    else if (F === "object") {
      if (typeof T.then == "function")
        return B(
          V(T),
          Q,
          $,
          P,
          ae
        );
      throw Q = String(T), Error(
        "Objects are not valid as a React child (found: " + (Q === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : Q) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ce;
  }
  function G(T, Q, $) {
    if (T == null) return T;
    var P = [], ae = 0;
    return B(T, P, "", "", function(F) {
      return Q.call($, F, ae++);
    }), P;
  }
  function le(T) {
    if (T._status === -1) {
      var Q = T._result;
      Q = Q(), Q.then(
        function($) {
          (T._status === 0 || T._status === -1) && (T._status = 1, T._result = $);
        },
        function($) {
          (T._status === 0 || T._status === -1) && (T._status = 2, T._result = $);
        }
      ), T._status === -1 && (T._status = 0, T._result = Q);
    }
    if (T._status === 1) return T._result.default;
    throw T._result;
  }
  var W = typeof reportError == "function" ? reportError : function(T) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var Q = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof T == "object" && T !== null && typeof T.message == "string" ? String(T.message) : String(T),
        error: T
      });
      if (!window.dispatchEvent(Q)) return;
    } else if (typeof a == "object" && typeof a.emit == "function") {
      a.emit("uncaughtException", T);
      return;
    }
    console.error(T);
  }, Be = {
    map: G,
    forEach: function(T, Q, $) {
      G(
        T,
        function() {
          Q.apply(this, arguments);
        },
        $
      );
    },
    count: function(T) {
      var Q = 0;
      return G(T, function() {
        Q++;
      }), Q;
    },
    toArray: function(T) {
      return G(T, function(Q) {
        return Q;
      }) || [];
    },
    only: function(T) {
      if (!de(T))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return T;
    }
  };
  return he.Activity = A, he.Children = Be, he.Component = O, he.Fragment = r, he.Profiler = d, he.PureComponent = Y, he.StrictMode = s, he.Suspense = h, he.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = X, he.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(T) {
      return X.H.useMemoCache(T);
    }
  }, he.cache = function(T) {
    return function() {
      return T.apply(null, arguments);
    };
  }, he.cacheSignal = function() {
    return null;
  }, he.cloneElement = function(T, Q, $) {
    if (T == null)
      throw Error(
        "The argument must be a React element, but you passed " + T + "."
      );
    var P = C({}, T.props), ae = T.key;
    if (Q != null)
      for (F in Q.key !== void 0 && (ae = "" + Q.key), Q)
        !ue.call(Q, F) || F === "key" || F === "__self" || F === "__source" || F === "ref" && Q.ref === void 0 || (P[F] = Q[F]);
    var F = arguments.length - 2;
    if (F === 1) P.children = $;
    else if (1 < F) {
      for (var ce = Array(F), re = 0; re < F; re++)
        ce[re] = arguments[re + 2];
      P.children = ce;
    }
    return me(T.type, ae, P);
  }, he.createContext = function(T) {
    return T = {
      $$typeof: v,
      _currentValue: T,
      _currentValue2: T,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, T.Provider = T, T.Consumer = {
      $$typeof: m,
      _context: T
    }, T;
  }, he.createElement = function(T, Q, $) {
    var P, ae = {}, F = null;
    if (Q != null)
      for (P in Q.key !== void 0 && (F = "" + Q.key), Q)
        ue.call(Q, P) && P !== "key" && P !== "__self" && P !== "__source" && (ae[P] = Q[P]);
    var ce = arguments.length - 2;
    if (ce === 1) ae.children = $;
    else if (1 < ce) {
      for (var re = Array(ce), se = 0; se < ce; se++)
        re[se] = arguments[se + 2];
      ae.children = re;
    }
    if (T && T.defaultProps)
      for (P in ce = T.defaultProps, ce)
        ae[P] === void 0 && (ae[P] = ce[P]);
    return me(T, F, ae);
  }, he.createRef = function() {
    return { current: null };
  }, he.forwardRef = function(T) {
    return { $$typeof: p, render: T };
  }, he.isValidElement = de, he.lazy = function(T) {
    return {
      $$typeof: E,
      _payload: { _status: -1, _result: T },
      _init: le
    };
  }, he.memo = function(T, Q) {
    return {
      $$typeof: b,
      type: T,
      compare: Q === void 0 ? null : Q
    };
  }, he.startTransition = function(T) {
    var Q = X.T, $ = {};
    X.T = $;
    try {
      var P = T(), ae = X.S;
      ae !== null && ae($, P), typeof P == "object" && P !== null && typeof P.then == "function" && P.then(J, W);
    } catch (F) {
      W(F);
    } finally {
      Q !== null && $.types !== null && (Q.types = $.types), X.T = Q;
    }
  }, he.unstable_useCacheRefresh = function() {
    return X.H.useCacheRefresh();
  }, he.use = function(T) {
    return X.H.use(T);
  }, he.useActionState = function(T, Q, $) {
    return X.H.useActionState(T, Q, $);
  }, he.useCallback = function(T, Q) {
    return X.H.useCallback(T, Q);
  }, he.useContext = function(T) {
    return X.H.useContext(T);
  }, he.useDebugValue = function() {
  }, he.useDeferredValue = function(T, Q) {
    return X.H.useDeferredValue(T, Q);
  }, he.useEffect = function(T, Q) {
    return X.H.useEffect(T, Q);
  }, he.useEffectEvent = function(T) {
    return X.H.useEffectEvent(T);
  }, he.useId = function() {
    return X.H.useId();
  }, he.useImperativeHandle = function(T, Q, $) {
    return X.H.useImperativeHandle(T, Q, $);
  }, he.useInsertionEffect = function(T, Q) {
    return X.H.useInsertionEffect(T, Q);
  }, he.useLayoutEffect = function(T, Q) {
    return X.H.useLayoutEffect(T, Q);
  }, he.useMemo = function(T, Q) {
    return X.H.useMemo(T, Q);
  }, he.useOptimistic = function(T, Q) {
    return X.H.useOptimistic(T, Q);
  }, he.useReducer = function(T, Q, $) {
    return X.H.useReducer(T, Q, $);
  }, he.useRef = function(T) {
    return X.H.useRef(T);
  }, he.useState = function(T) {
    return X.H.useState(T);
  }, he.useSyncExternalStore = function(T, Q, $) {
    return X.H.useSyncExternalStore(
      T,
      Q,
      $
    );
  }, he.useTransition = function() {
    return X.H.useTransition();
  }, he.version = "19.2.6", he;
}
var Nh;
function fs() {
  return Nh || (Nh = 1, Yr.exports = _b()), Yr.exports;
}
var qr = { exports: {} }, st = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dh;
function Rb() {
  if (Dh) return st;
  Dh = 1;
  var a = fs();
  function c(p) {
    var h = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      h += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        h += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + p + "; visit " + h + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var r = {
    d: {
      f: o,
      r: function() {
        throw Error(c(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, s = Symbol.for("react.portal");
  function d(p, h, b) {
    var E = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: s,
      key: E == null ? null : "" + E,
      children: p,
      containerInfo: h,
      implementation: b
    };
  }
  var m = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function v(p, h) {
    if (p === "font") return "";
    if (typeof h == "string")
      return h === "use-credentials" ? h : "";
  }
  return st.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, st.createPortal = function(p, h) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!h || h.nodeType !== 1 && h.nodeType !== 9 && h.nodeType !== 11)
      throw Error(c(299));
    return d(p, h, null, b);
  }, st.flushSync = function(p) {
    var h = m.T, b = r.p;
    try {
      if (m.T = null, r.p = 2, p) return p();
    } finally {
      m.T = h, r.p = b, r.d.f();
    }
  }, st.preconnect = function(p, h) {
    typeof p == "string" && (h ? (h = h.crossOrigin, h = typeof h == "string" ? h === "use-credentials" ? h : "" : void 0) : h = null, r.d.C(p, h));
  }, st.prefetchDNS = function(p) {
    typeof p == "string" && r.d.D(p);
  }, st.preinit = function(p, h) {
    if (typeof p == "string" && h && typeof h.as == "string") {
      var b = h.as, E = v(b, h.crossOrigin), A = typeof h.integrity == "string" ? h.integrity : void 0, R = typeof h.fetchPriority == "string" ? h.fetchPriority : void 0;
      b === "style" ? r.d.S(
        p,
        typeof h.precedence == "string" ? h.precedence : void 0,
        {
          crossOrigin: E,
          integrity: A,
          fetchPriority: R
        }
      ) : b === "script" && r.d.X(p, {
        crossOrigin: E,
        integrity: A,
        fetchPriority: R,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0
      });
    }
  }, st.preinitModule = function(p, h) {
    if (typeof p == "string")
      if (typeof h == "object" && h !== null) {
        if (h.as == null || h.as === "script") {
          var b = v(
            h.as,
            h.crossOrigin
          );
          r.d.M(p, {
            crossOrigin: b,
            integrity: typeof h.integrity == "string" ? h.integrity : void 0,
            nonce: typeof h.nonce == "string" ? h.nonce : void 0
          });
        }
      } else h == null && r.d.M(p);
  }, st.preload = function(p, h) {
    if (typeof p == "string" && typeof h == "object" && h !== null && typeof h.as == "string") {
      var b = h.as, E = v(b, h.crossOrigin);
      r.d.L(p, b, {
        crossOrigin: E,
        integrity: typeof h.integrity == "string" ? h.integrity : void 0,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0,
        type: typeof h.type == "string" ? h.type : void 0,
        fetchPriority: typeof h.fetchPriority == "string" ? h.fetchPriority : void 0,
        referrerPolicy: typeof h.referrerPolicy == "string" ? h.referrerPolicy : void 0,
        imageSrcSet: typeof h.imageSrcSet == "string" ? h.imageSrcSet : void 0,
        imageSizes: typeof h.imageSizes == "string" ? h.imageSizes : void 0,
        media: typeof h.media == "string" ? h.media : void 0
      });
    }
  }, st.preloadModule = function(p, h) {
    if (typeof p == "string")
      if (h) {
        var b = v(h.as, h.crossOrigin);
        r.d.m(p, {
          as: typeof h.as == "string" && h.as !== "script" ? h.as : void 0,
          crossOrigin: b,
          integrity: typeof h.integrity == "string" ? h.integrity : void 0
        });
      } else r.d.m(p);
  }, st.requestFormReset = function(p) {
    r.d.r(p);
  }, st.unstable_batchedUpdates = function(p, h) {
    return p(h);
  }, st.useFormState = function(p, h, b) {
    return m.H.useFormState(p, h, b);
  }, st.useFormStatus = function() {
    return m.H.useHostTransitionStatus();
  }, st.version = "19.2.6", st;
}
var Uh;
function Sv() {
  if (Uh) return qr.exports;
  Uh = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (c) {
        console.error(c);
      }
  }
  return a(), qr.exports = Rb(), qr.exports;
}
var jh;
function zb() {
  if (jh) return xi;
  jh = 1;
  var a = { env: { NODE_ENV: "production" }, browser: !0, version: "" };
  /**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var c = Ob(), o = fs(), r = Sv();
  function s(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function m(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function v(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (m(e) !== e)
      throw Error(s(188));
  }
  function b(e) {
    var t = e.alternate;
    if (!t) {
      if (t = m(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ; ) {
      var i = n.return;
      if (i === null) break;
      var u = i.alternate;
      if (u === null) {
        if (l = i.return, l !== null) {
          n = l;
          continue;
        }
        break;
      }
      if (i.child === u.child) {
        for (u = i.child; u; ) {
          if (u === n) return h(i), e;
          if (u === l) return h(i), t;
          u = u.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== l.return) n = i, l = u;
      else {
        for (var f = !1, g = i.child; g; ) {
          if (g === n) {
            f = !0, n = i, l = u;
            break;
          }
          if (g === l) {
            f = !0, l = i, n = u;
            break;
          }
          g = g.sibling;
        }
        if (!f) {
          for (g = u.child; g; ) {
            if (g === n) {
              f = !0, n = u, l = i;
              break;
            }
            if (g === l) {
              f = !0, l = u, n = i;
              break;
            }
            g = g.sibling;
          }
          if (!f) throw Error(s(189));
        }
      }
      if (n.alternate !== l) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function E(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = E(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var A = Object.assign, R = Symbol.for("react.element"), D = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), C = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), O = Symbol.for("react.profiler"), U = Symbol.for("react.consumer"), Y = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), J = Symbol.for("react.suspense_list"), X = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), me = Symbol.for("react.activity"), be = Symbol.for("react.memo_cache_sentinel"), de = Symbol.iterator;
  function ve(e) {
    return e === null || typeof e != "object" ? null : (e = de && e[de] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ge = Symbol.for("react.client.reference");
  function pe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ge ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case C:
        return "Fragment";
      case O:
        return "Profiler";
      case j:
        return "StrictMode";
      case I:
        return "Suspense";
      case J:
        return "SuspenseList";
      case me:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case S:
          return "Portal";
        case Y:
          return e.displayName || "Context";
        case U:
          return (e._context.displayName || "Context") + ".Consumer";
        case k:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case X:
          return t = e.displayName || null, t !== null ? t : pe(e.type) || "Memo";
        case ue:
          t = e._payload, e = e._init;
          try {
            return pe(e(t));
          } catch {
          }
      }
    return null;
  }
  var V = Array.isArray, B = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, G = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, W = [], Be = -1;
  function T(e) {
    return { current: e };
  }
  function Q(e) {
    0 > Be || (e.current = W[Be], W[Be] = null, Be--);
  }
  function $(e, t) {
    Be++, W[Be] = e.current, e.current = t;
  }
  var P = T(null), ae = T(null), F = T(null), ce = T(null);
  function re(e, t) {
    switch ($(F, t), $(ae, e), $(P, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? $m(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = $m(t), e = Fm(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    Q(P), $(P, e);
  }
  function se() {
    Q(P), Q(ae), Q(F);
  }
  function xe(e) {
    e.memoizedState !== null && $(ce, e);
    var t = P.current, n = Fm(t, e.type);
    t !== n && ($(ae, e), $(P, n));
  }
  function Ae(e) {
    ae.current === e && (Q(P), Q(ae)), ce.current === e && (Q(ce), gi._currentValue = le);
  }
  var Qe, tt;
  function St(e) {
    if (Qe === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        Qe = t && t[1] || "", tt = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Qe + e + tt;
  }
  var an = !1;
  function un(e, t) {
    if (!e || an) return "";
    an = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var K = function() {
                throw Error();
              };
              if (Object.defineProperty(K.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(K, []);
                } catch (H) {
                  var N = H;
                }
                Reflect.construct(e, [], K);
              } else {
                try {
                  K.call();
                } catch (H) {
                  N = H;
                }
                e.call(K.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (H) {
                N = H;
              }
              (K = e()) && typeof K.catch == "function" && K.catch(function() {
              });
            }
          } catch (H) {
            if (H && N && typeof H.stack == "string")
              return [H.stack, N.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      i && i.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = l.DetermineComponentFrameRoot(), f = u[0], g = u[1];
      if (f && g) {
        var x = f.split(`
`), M = g.split(`
`);
        for (i = l = 0; l < x.length && !x[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; i < M.length && !M[i].includes(
          "DetermineComponentFrameRoot"
        ); )
          i++;
        if (l === x.length || i === M.length)
          for (l = x.length - 1, i = M.length - 1; 1 <= l && 0 <= i && x[l] !== M[i]; )
            i--;
        for (; 1 <= l && 0 <= i; l--, i--)
          if (x[l] !== M[i]) {
            if (l !== 1 || i !== 1)
              do
                if (l--, i--, 0 > i || x[l] !== M[i]) {
                  var q = `
` + x[l].replace(" at new ", " at ");
                  return e.displayName && q.includes("<anonymous>") && (q = q.replace("<anonymous>", e.displayName)), q;
                }
              while (1 <= l && 0 <= i);
            break;
          }
      }
    } finally {
      an = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? St(n) : "";
  }
  function yc(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return St(e.type);
      case 16:
        return St("Lazy");
      case 13:
        return e.child !== t && t !== null ? St("Suspense Fallback") : St("Suspense");
      case 19:
        return St("SuspenseList");
      case 0:
      case 15:
        return un(e.type, !1);
      case 11:
        return un(e.type.render, !1);
      case 1:
        return un(e.type, !0);
      case 31:
        return St("Activity");
      default:
        return "";
    }
  }
  function rl(e) {
    try {
      var t = "", n = null;
      do
        t += yc(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var bc = Object.prototype.hasOwnProperty, Sc = c.unstable_scheduleCallback, xc = c.unstable_cancelCallback, tp = c.unstable_shouldYield, np = c.unstable_requestPaint, xt = c.unstable_now, lp = c.unstable_getCurrentPriorityLevel, Os = c.unstable_ImmediatePriority, _s = c.unstable_UserBlockingPriority, _i = c.unstable_NormalPriority, ap = c.unstable_LowPriority, Rs = c.unstable_IdlePriority, ip = c.log, up = c.unstable_setDisableYieldValue, _a = null, Et = null;
  function Rn(e) {
    if (typeof ip == "function" && up(e), Et && typeof Et.setStrictMode == "function")
      try {
        Et.setStrictMode(_a, e);
      } catch {
      }
  }
  var At = Math.clz32 ? Math.clz32 : rp, cp = Math.log, op = Math.LN2;
  function rp(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (cp(e) / op | 0) | 0;
  }
  var Ri = 256, zi = 262144, Mi = 4194304;
  function sl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Ni(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var i = 0, u = e.suspendedLanes, f = e.pingedLanes;
    e = e.warmLanes;
    var g = l & 134217727;
    return g !== 0 ? (l = g & ~u, l !== 0 ? i = sl(l) : (f &= g, f !== 0 ? i = sl(f) : n || (n = g & ~e, n !== 0 && (i = sl(n))))) : (g = l & ~u, g !== 0 ? i = sl(g) : f !== 0 ? i = sl(f) : n || (n = l & ~e, n !== 0 && (i = sl(n)))), i === 0 ? 0 : t !== 0 && t !== i && (t & u) === 0 && (u = i & -i, n = t & -t, u >= n || u === 32 && (n & 4194048) !== 0) ? t : i;
  }
  function Ra(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function sp(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function zs() {
    var e = Mi;
    return Mi <<= 1, (Mi & 62914560) === 0 && (Mi = 4194304), e;
  }
  function Ec(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function za(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function fp(e, t, n, l, i, u) {
    var f = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var g = e.entanglements, x = e.expirationTimes, M = e.hiddenUpdates;
    for (n = f & ~n; 0 < n; ) {
      var q = 31 - At(n), K = 1 << q;
      g[q] = 0, x[q] = -1;
      var N = M[q];
      if (N !== null)
        for (M[q] = null, q = 0; q < N.length; q++) {
          var H = N[q];
          H !== null && (H.lane &= -536870913);
        }
      n &= ~K;
    }
    l !== 0 && Ms(e, l, 0), u !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(f & ~t));
  }
  function Ms(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - At(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930;
  }
  function Ns(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - At(n), i = 1 << l;
      i & t | e[l] & t && (e[l] |= t), n &= ~i;
    }
  }
  function Ds(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : Ac(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function Ac(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Tc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Us() {
    var e = G.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Sh(e.type));
  }
  function js(e, t) {
    var n = G.p;
    try {
      return G.p = e, t();
    } finally {
      G.p = n;
    }
  }
  var zn = Math.random().toString(36).slice(2), at = "__reactFiber$" + zn, dt = "__reactProps$" + zn, jl = "__reactContainer$" + zn, wc = "__reactEvents$" + zn, dp = "__reactListeners$" + zn, mp = "__reactHandles$" + zn, Hs = "__reactResources$" + zn, Ma = "__reactMarker$" + zn;
  function Cc(e) {
    delete e[at], delete e[dt], delete e[wc], delete e[dp], delete e[mp];
  }
  function Hl(e) {
    var t = e[at];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[jl] || n[at]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = ah(e); e !== null; ) {
            if (n = e[at]) return n;
            e = ah(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Ll(e) {
    if (e = e[at] || e[jl]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Na(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(s(33));
  }
  function Bl(e) {
    var t = e[Hs];
    return t || (t = e[Hs] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function nt(e) {
    e[Ma] = !0;
  }
  var Ls = /* @__PURE__ */ new Set(), Bs = {};
  function fl(e, t) {
    Yl(e, t), Yl(e + "Capture", t);
  }
  function Yl(e, t) {
    for (Bs[e] = t, e = 0; e < t.length; e++)
      Ls.add(t[e]);
  }
  var hp = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ys = {}, qs = {};
  function vp(e) {
    return bc.call(qs, e) ? !0 : bc.call(Ys, e) ? !1 : hp.test(e) ? qs[e] = !0 : (Ys[e] = !0, !1);
  }
  function Di(e, t, n) {
    if (vp(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function Ui(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function cn(e, t, n, l) {
    if (l === null) e.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + l);
    }
  }
  function Dt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Gs(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function gp(e, t, n) {
    var l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var i = l.get, u = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return i.call(this);
        },
        set: function(f) {
          n = "" + f, u.call(this, f);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(f) {
          n = "" + f;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Oc(e) {
    if (!e._valueTracker) {
      var t = Gs(e) ? "checked" : "value";
      e._valueTracker = gp(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Vs(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = Gs(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ji(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var pp = /[\n"\\]/g;
  function Ut(e) {
    return e.replace(
      pp,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function _c(e, t, n, l, i, u, f, g) {
    e.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? e.type = f : e.removeAttribute("type"), t != null ? f === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Dt(t)) : e.value !== "" + Dt(t) && (e.value = "" + Dt(t)) : f !== "submit" && f !== "reset" || e.removeAttribute("value"), t != null ? Rc(e, f, Dt(t)) : n != null ? Rc(e, f, Dt(n)) : l != null && e.removeAttribute("value"), i == null && u != null && (e.defaultChecked = !!u), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? e.name = "" + Dt(g) : e.removeAttribute("name");
  }
  function Xs(e, t, n, l, i, u, f, g) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        Oc(e);
        return;
      }
      n = n != null ? "" + Dt(n) : "", t = t != null ? "" + Dt(t) : n, g || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? i, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = g ? e.checked : !!l, e.defaultChecked = !!l, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (e.name = f), Oc(e);
  }
  function Rc(e, t, n) {
    t === "number" && ji(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function ql(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var i = 0; i < n.length; i++)
        t["$" + n[i]] = !0;
      for (n = 0; n < e.length; n++)
        i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Dt(n), t = null, i = 0; i < e.length; i++) {
        if (e[i].value === n) {
          e[i].selected = !0, l && (e[i].defaultSelected = !0);
          return;
        }
        t !== null || e[i].disabled || (t = e[i]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Qs(e, t, n) {
    if (t != null && (t = "" + Dt(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Dt(n) : "";
  }
  function Zs(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(s(92));
        if (V(l)) {
          if (1 < l.length) throw Error(s(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = Dt(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l), Oc(e);
  }
  function Gl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var yp = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ks(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || yp.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function ks(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var i in t)
        l = t[i], t.hasOwnProperty(i) && n[i] !== l && Ks(e, i, l);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Ks(e, u, t[u]);
  }
  function zc(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var bp = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Sp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Hi(e) {
    return Sp.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function on() {
  }
  var Mc = null;
  function Nc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Vl = null, Xl = null;
  function Js(e) {
    var t = Ll(e);
    if (t && (e = t.stateNode)) {
      var n = e[dt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (_c(
            e,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), t = n.name, n.type === "radio" && t != null) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + Ut(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var i = l[dt] || null;
                if (!i) throw Error(s(90));
                _c(
                  l,
                  i.value,
                  i.defaultValue,
                  i.defaultValue,
                  i.checked,
                  i.defaultChecked,
                  i.type,
                  i.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              l = n[t], l.form === e.form && Vs(l);
          }
          break e;
        case "textarea":
          Qs(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && ql(e, !!n.multiple, t, !1);
      }
    }
  }
  var Dc = !1;
  function Ws(e, t, n) {
    if (Dc) return e(t, n);
    Dc = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (Dc = !1, (Vl !== null || Xl !== null) && (Au(), Vl && (t = Vl, e = Xl, Xl = Vl = null, Js(t), e)))
        for (t = 0; t < e.length; t++) Js(e[t]);
    }
  }
  function Da(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[dt] || null;
    if (l === null) return null;
    n = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function")
      throw Error(
        s(231, t, typeof n)
      );
    return n;
  }
  var rn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Uc = !1;
  if (rn)
    try {
      var Ua = {};
      Object.defineProperty(Ua, "passive", {
        get: function() {
          Uc = !0;
        }
      }), window.addEventListener("test", Ua, Ua), window.removeEventListener("test", Ua, Ua);
    } catch {
      Uc = !1;
    }
  var Mn = null, jc = null, Li = null;
  function $s() {
    if (Li) return Li;
    var e, t = jc, n = t.length, l, i = "value" in Mn ? Mn.value : Mn.textContent, u = i.length;
    for (e = 0; e < n && t[e] === i[e]; e++) ;
    var f = n - e;
    for (l = 1; l <= f && t[n - l] === i[u - l]; l++) ;
    return Li = i.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Bi(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Yi() {
    return !0;
  }
  function Fs() {
    return !1;
  }
  function mt(e) {
    function t(n, l, i, u, f) {
      this._reactName = n, this._targetInst = i, this.type = l, this.nativeEvent = u, this.target = f, this.currentTarget = null;
      for (var g in e)
        e.hasOwnProperty(g) && (n = e[g], this[g] = n ? n(u) : u[g]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Yi : Fs, this.isPropagationStopped = Fs, this;
    }
    return A(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Yi);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Yi);
      },
      persist: function() {
      },
      isPersistent: Yi
    }), t;
  }
  var dl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, qi = mt(dl), ja = A({}, dl, { view: 0, detail: 0 }), xp = mt(ja), Hc, Lc, Ha, Gi = A({}, ja, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Yc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ha && (Ha && e.type === "mousemove" ? (Hc = e.screenX - Ha.screenX, Lc = e.screenY - Ha.screenY) : Lc = Hc = 0, Ha = e), Hc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Lc;
    }
  }), Is = mt(Gi), Ep = A({}, Gi, { dataTransfer: 0 }), Ap = mt(Ep), Tp = A({}, ja, { relatedTarget: 0 }), Bc = mt(Tp), wp = A({}, dl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Cp = mt(wp), Op = A({}, dl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), _p = mt(Op), Rp = A({}, dl, { data: 0 }), Ps = mt(Rp), zp = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Mp = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Np = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Dp(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Np[e]) ? !!t[e] : !1;
  }
  function Yc() {
    return Dp;
  }
  var Up = A({}, ja, {
    key: function(e) {
      if (e.key) {
        var t = zp[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Bi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Mp[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Yc,
    charCode: function(e) {
      return e.type === "keypress" ? Bi(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Bi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), jp = mt(Up), Hp = A({}, Gi, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), ef = mt(Hp), Lp = A({}, ja, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Yc
  }), Bp = mt(Lp), Yp = A({}, dl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), qp = mt(Yp), Gp = A({}, Gi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Vp = mt(Gp), Xp = A({}, dl, {
    newState: 0,
    oldState: 0
  }), Qp = mt(Xp), Zp = [9, 13, 27, 32], qc = rn && "CompositionEvent" in window, La = null;
  rn && "documentMode" in document && (La = document.documentMode);
  var Kp = rn && "TextEvent" in window && !La, tf = rn && (!qc || La && 8 < La && 11 >= La), nf = " ", lf = !1;
  function af(e, t) {
    switch (e) {
      case "keyup":
        return Zp.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function uf(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ql = !1;
  function kp(e, t) {
    switch (e) {
      case "compositionend":
        return uf(t);
      case "keypress":
        return t.which !== 32 ? null : (lf = !0, nf);
      case "textInput":
        return e = t.data, e === nf && lf ? null : e;
      default:
        return null;
    }
  }
  function Jp(e, t) {
    if (Ql)
      return e === "compositionend" || !qc && af(e, t) ? (e = $s(), Li = jc = Mn = null, Ql = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return tf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Wp = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function cf(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Wp[e.type] : t === "textarea";
  }
  function of(e, t, n, l) {
    Vl ? Xl ? Xl.push(l) : Xl = [l] : Vl = l, t = zu(t, "onChange"), 0 < t.length && (n = new qi(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var Ba = null, Ya = null;
  function $p(e) {
    Qm(e, 0);
  }
  function Vi(e) {
    var t = Na(e);
    if (Vs(t)) return e;
  }
  function rf(e, t) {
    if (e === "change") return t;
  }
  var sf = !1;
  if (rn) {
    var Gc;
    if (rn) {
      var Vc = "oninput" in document;
      if (!Vc) {
        var ff = document.createElement("div");
        ff.setAttribute("oninput", "return;"), Vc = typeof ff.oninput == "function";
      }
      Gc = Vc;
    } else Gc = !1;
    sf = Gc && (!document.documentMode || 9 < document.documentMode);
  }
  function df() {
    Ba && (Ba.detachEvent("onpropertychange", mf), Ya = Ba = null);
  }
  function mf(e) {
    if (e.propertyName === "value" && Vi(Ya)) {
      var t = [];
      of(
        t,
        Ya,
        e,
        Nc(e)
      ), Ws($p, t);
    }
  }
  function Fp(e, t, n) {
    e === "focusin" ? (df(), Ba = t, Ya = n, Ba.attachEvent("onpropertychange", mf)) : e === "focusout" && df();
  }
  function Ip(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Vi(Ya);
  }
  function Pp(e, t) {
    if (e === "click") return Vi(t);
  }
  function ey(e, t) {
    if (e === "input" || e === "change")
      return Vi(t);
  }
  function ty(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Tt = typeof Object.is == "function" ? Object.is : ty;
  function qa(e, t) {
    if (Tt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var i = n[l];
      if (!bc.call(t, i) || !Tt(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  function hf(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function vf(e, t) {
    var n = hf(e);
    e = 0;
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (l = e + n.textContent.length, e <= t && l >= t)
          return { node: n, offset: t - e };
        e = l;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = hf(n);
    }
  }
  function gf(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? gf(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function pf(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = ji(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ji(e.document);
    }
    return t;
  }
  function Xc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var ny = rn && "documentMode" in document && 11 >= document.documentMode, Zl = null, Qc = null, Ga = null, Zc = !1;
  function yf(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Zc || Zl == null || Zl !== ji(l) || (l = Zl, "selectionStart" in l && Xc(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), Ga && qa(Ga, l) || (Ga = l, l = zu(Qc, "onSelect"), 0 < l.length && (t = new qi(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = Zl)));
  }
  function ml(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Kl = {
    animationend: ml("Animation", "AnimationEnd"),
    animationiteration: ml("Animation", "AnimationIteration"),
    animationstart: ml("Animation", "AnimationStart"),
    transitionrun: ml("Transition", "TransitionRun"),
    transitionstart: ml("Transition", "TransitionStart"),
    transitioncancel: ml("Transition", "TransitionCancel"),
    transitionend: ml("Transition", "TransitionEnd")
  }, Kc = {}, bf = {};
  rn && (bf = document.createElement("div").style, "AnimationEvent" in window || (delete Kl.animationend.animation, delete Kl.animationiteration.animation, delete Kl.animationstart.animation), "TransitionEvent" in window || delete Kl.transitionend.transition);
  function hl(e) {
    if (Kc[e]) return Kc[e];
    if (!Kl[e]) return e;
    var t = Kl[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in bf)
        return Kc[e] = t[n];
    return e;
  }
  var Sf = hl("animationend"), xf = hl("animationiteration"), Ef = hl("animationstart"), ly = hl("transitionrun"), ay = hl("transitionstart"), iy = hl("transitioncancel"), Af = hl("transitionend"), Tf = /* @__PURE__ */ new Map(), kc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  kc.push("scrollEnd");
  function Xt(e, t) {
    Tf.set(e, t), fl(t, [e]);
  }
  var Xi = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof a == "object" && typeof a.emit == "function") {
      a.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, jt = [], kl = 0, Jc = 0;
  function Qi() {
    for (var e = kl, t = Jc = kl = 0; t < e; ) {
      var n = jt[t];
      jt[t++] = null;
      var l = jt[t];
      jt[t++] = null;
      var i = jt[t];
      jt[t++] = null;
      var u = jt[t];
      if (jt[t++] = null, l !== null && i !== null) {
        var f = l.pending;
        f === null ? i.next = i : (i.next = f.next, f.next = i), l.pending = i;
      }
      u !== 0 && wf(n, i, u);
    }
  }
  function Zi(e, t, n, l) {
    jt[kl++] = e, jt[kl++] = t, jt[kl++] = n, jt[kl++] = l, Jc |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Wc(e, t, n, l) {
    return Zi(e, t, n, l), Ki(e);
  }
  function vl(e, t) {
    return Zi(e, null, null, t), Ki(e);
  }
  function wf(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var i = !1, u = e.return; u !== null; )
      u.childLanes |= n, l = u.alternate, l !== null && (l.childLanes |= n), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (i = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, i && t !== null && (i = 31 - At(n), e = u.hiddenUpdates, l = e[i], l === null ? e[i] = [t] : l.push(t), t.lane = n | 536870912), u) : null;
  }
  function Ki(e) {
    if (50 < ri)
      throw ri = 0, ir = null, Error(s(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Jl = {};
  function uy(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function wt(e, t, n, l) {
    return new uy(e, t, n, l);
  }
  function $c(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function sn(e, t) {
    var n = e.alternate;
    return n === null ? (n = wt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function Cf(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ki(e, t, n, l, i, u) {
    var f = 0;
    if (l = e, typeof e == "function") $c(e) && (f = 1);
    else if (typeof e == "string")
      f = fb(
        e,
        n,
        P.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case me:
          return e = wt(31, n, t, i), e.elementType = me, e.lanes = u, e;
        case C:
          return gl(n.children, i, u, t);
        case j:
          f = 8, i |= 24;
          break;
        case O:
          return e = wt(12, n, t, i | 2), e.elementType = O, e.lanes = u, e;
        case I:
          return e = wt(13, n, t, i), e.elementType = I, e.lanes = u, e;
        case J:
          return e = wt(19, n, t, i), e.elementType = J, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Y:
                f = 10;
                break e;
              case U:
                f = 9;
                break e;
              case k:
                f = 11;
                break e;
              case X:
                f = 14;
                break e;
              case ue:
                f = 16, l = null;
                break e;
            }
          f = 29, n = Error(
            s(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = wt(f, n, t, i), t.elementType = e, t.type = l, t.lanes = u, t;
  }
  function gl(e, t, n, l) {
    return e = wt(7, e, l, t), e.lanes = n, e;
  }
  function Fc(e, t, n) {
    return e = wt(6, e, null, t), e.lanes = n, e;
  }
  function Of(e) {
    var t = wt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Ic(e, t, n) {
    return t = wt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var _f = /* @__PURE__ */ new WeakMap();
  function Ht(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = _f.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: rl(t)
      }, _f.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: rl(t)
    };
  }
  var Wl = [], $l = 0, Ji = null, Va = 0, Lt = [], Bt = 0, Nn = null, Wt = 1, $t = "";
  function fn(e, t) {
    Wl[$l++] = Va, Wl[$l++] = Ji, Ji = e, Va = t;
  }
  function Rf(e, t, n) {
    Lt[Bt++] = Wt, Lt[Bt++] = $t, Lt[Bt++] = Nn, Nn = e;
    var l = Wt;
    e = $t;
    var i = 32 - At(l) - 1;
    l &= ~(1 << i), n += 1;
    var u = 32 - At(t) + i;
    if (30 < u) {
      var f = i - i % 5;
      u = (l & (1 << f) - 1).toString(32), l >>= f, i -= f, Wt = 1 << 32 - At(t) + i | n << i | l, $t = u + e;
    } else
      Wt = 1 << u | n << i | l, $t = e;
  }
  function Pc(e) {
    e.return !== null && (fn(e, 1), Rf(e, 1, 0));
  }
  function eo(e) {
    for (; e === Ji; )
      Ji = Wl[--$l], Wl[$l] = null, Va = Wl[--$l], Wl[$l] = null;
    for (; e === Nn; )
      Nn = Lt[--Bt], Lt[Bt] = null, $t = Lt[--Bt], Lt[Bt] = null, Wt = Lt[--Bt], Lt[Bt] = null;
  }
  function zf(e, t) {
    Lt[Bt++] = Wt, Lt[Bt++] = $t, Lt[Bt++] = Nn, Wt = t.id, $t = t.overflow, Nn = e;
  }
  var it = null, Ye = null, _e = !1, Dn = null, Yt = !1, to = Error(s(519));
  function Un(e) {
    var t = Error(
      s(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Xa(Ht(t, e)), to;
  }
  function Mf(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[at] = e, t[dt] = l, n) {
      case "dialog":
        we("cancel", t), we("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        we("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < fi.length; n++)
          we(fi[n], t);
        break;
      case "source":
        we("error", t);
        break;
      case "img":
      case "image":
      case "link":
        we("error", t), we("load", t);
        break;
      case "details":
        we("toggle", t);
        break;
      case "input":
        we("invalid", t), Xs(
          t,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        );
        break;
      case "select":
        we("invalid", t);
        break;
      case "textarea":
        we("invalid", t), Zs(t, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || Jm(t.textContent, n) ? (l.popover != null && (we("beforetoggle", t), we("toggle", t)), l.onScroll != null && we("scroll", t), l.onScrollEnd != null && we("scrollend", t), l.onClick != null && (t.onclick = on), t = !0) : t = !1, t || Un(e, !0);
  }
  function Nf(e) {
    for (it = e.return; it; )
      switch (it.tag) {
        case 5:
        case 31:
        case 13:
          Yt = !1;
          return;
        case 27:
        case 3:
          Yt = !0;
          return;
        default:
          it = it.return;
      }
  }
  function Fl(e) {
    if (e !== it) return !1;
    if (!_e) return Nf(e), _e = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Sr(e.type, e.memoizedProps)), n = !n), n && Ye && Un(e), Nf(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Ye = lh(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Ye = lh(e);
    } else
      t === 27 ? (t = Ye, Jn(e.type) ? (e = wr, wr = null, Ye = e) : Ye = t) : Ye = it ? Gt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function pl() {
    Ye = it = null, _e = !1;
  }
  function no() {
    var e = Dn;
    return e !== null && (pt === null ? pt = e : pt.push.apply(
      pt,
      e
    ), Dn = null), e;
  }
  function Xa(e) {
    Dn === null ? Dn = [e] : Dn.push(e);
  }
  var lo = T(null), yl = null, dn = null;
  function jn(e, t, n) {
    $(lo, t._currentValue), t._currentValue = n;
  }
  function mn(e) {
    e._currentValue = lo.current, Q(lo);
  }
  function ao(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function io(e, t, n, l) {
    var i = e.child;
    for (i !== null && (i.return = e); i !== null; ) {
      var u = i.dependencies;
      if (u !== null) {
        var f = i.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var g = u;
          u = i;
          for (var x = 0; x < t.length; x++)
            if (g.context === t[x]) {
              u.lanes |= n, g = u.alternate, g !== null && (g.lanes |= n), ao(
                u.return,
                n,
                e
              ), l || (f = null);
              break e;
            }
          u = g.next;
        }
      } else if (i.tag === 18) {
        if (f = i.return, f === null) throw Error(s(341));
        f.lanes |= n, u = f.alternate, u !== null && (u.lanes |= n), ao(f, n, e), f = null;
      } else f = i.child;
      if (f !== null) f.return = i;
      else
        for (f = i; f !== null; ) {
          if (f === e) {
            f = null;
            break;
          }
          if (i = f.sibling, i !== null) {
            i.return = f.return, f = i;
            break;
          }
          f = f.return;
        }
      i = f;
    }
  }
  function Il(e, t, n, l) {
    e = null;
    for (var i = t, u = !1; i !== null; ) {
      if (!u) {
        if ((i.flags & 524288) !== 0) u = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var f = i.alternate;
        if (f === null) throw Error(s(387));
        if (f = f.memoizedProps, f !== null) {
          var g = i.type;
          Tt(i.pendingProps.value, f.value) || (e !== null ? e.push(g) : e = [g]);
        }
      } else if (i === ce.current) {
        if (f = i.alternate, f === null) throw Error(s(387));
        f.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e !== null ? e.push(gi) : e = [gi]);
      }
      i = i.return;
    }
    e !== null && io(
      t,
      e,
      n,
      l
    ), t.flags |= 262144;
  }
  function Wi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Tt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function bl(e) {
    yl = e, dn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ut(e) {
    return Df(yl, e);
  }
  function $i(e, t) {
    return yl === null && bl(e), Df(e, t);
  }
  function Df(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, dn === null) {
      if (e === null) throw Error(s(308));
      dn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else dn = dn.next = t;
    return n;
  }
  var cy = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, oy = c.unstable_scheduleCallback, ry = c.unstable_NormalPriority, Je = {
    $$typeof: Y,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function uo() {
    return {
      controller: new cy(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Qa(e) {
    e.refCount--, e.refCount === 0 && oy(ry, function() {
      e.controller.abort();
    });
  }
  var Za = null, co = 0, Pl = 0, ea = null;
  function sy(e, t) {
    if (Za === null) {
      var n = Za = [];
      co = 0, Pl = fr(), ea = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return co++, t.then(Uf, Uf), t;
  }
  function Uf() {
    if (--co === 0 && Za !== null) {
      ea !== null && (ea.status = "fulfilled");
      var e = Za;
      Za = null, Pl = 0, ea = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function fy(e, t) {
    var n = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(i) {
        n.push(i);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var i = 0; i < n.length; i++) (0, n[i])(t);
      },
      function(i) {
        for (l.status = "rejected", l.reason = i, i = 0; i < n.length; i++)
          (0, n[i])(void 0);
      }
    ), l;
  }
  var jf = B.S;
  B.S = function(e, t) {
    ym = xt(), typeof t == "object" && t !== null && typeof t.then == "function" && sy(e, t), jf !== null && jf(e, t);
  };
  var Sl = T(null);
  function oo() {
    var e = Sl.current;
    return e !== null ? e : Le.pooledCache;
  }
  function Fi(e, t) {
    t === null ? $(Sl, Sl.current) : $(Sl, t.pool);
  }
  function Hf() {
    var e = oo();
    return e === null ? null : { parent: Je._currentValue, pool: e };
  }
  var ta = Error(s(460)), ro = Error(s(474)), Ii = Error(s(542)), Pi = { then: function() {
  } };
  function Lf(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Bf(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(on, on), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, qf(e), e;
      default:
        if (typeof t.status == "string") t.then(on, on);
        else {
          if (e = Le, e !== null && 100 < e.shellSuspendCounter)
            throw Error(s(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var i = t;
                i.status = "fulfilled", i.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var i = t;
                i.status = "rejected", i.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, qf(e), e;
        }
        throw El = t, ta;
    }
  }
  function xl(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (El = n, ta) : n;
    }
  }
  var El = null;
  function Yf() {
    if (El === null) throw Error(s(459));
    var e = El;
    return El = null, e;
  }
  function qf(e) {
    if (e === ta || e === Ii)
      throw Error(s(483));
  }
  var na = null, Ka = 0;
  function eu(e) {
    var t = Ka;
    return Ka += 1, na === null && (na = []), Bf(na, e, t);
  }
  function ka(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function tu(e, t) {
    throw t.$$typeof === R ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(
      s(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Gf(e) {
    function t(_, w) {
      if (e) {
        var z = _.deletions;
        z === null ? (_.deletions = [w], _.flags |= 16) : z.push(w);
      }
    }
    function n(_, w) {
      if (!e) return null;
      for (; w !== null; )
        t(_, w), w = w.sibling;
      return null;
    }
    function l(_) {
      for (var w = /* @__PURE__ */ new Map(); _ !== null; )
        _.key !== null ? w.set(_.key, _) : w.set(_.index, _), _ = _.sibling;
      return w;
    }
    function i(_, w) {
      return _ = sn(_, w), _.index = 0, _.sibling = null, _;
    }
    function u(_, w, z) {
      return _.index = z, e ? (z = _.alternate, z !== null ? (z = z.index, z < w ? (_.flags |= 67108866, w) : z) : (_.flags |= 67108866, w)) : (_.flags |= 1048576, w);
    }
    function f(_) {
      return e && _.alternate === null && (_.flags |= 67108866), _;
    }
    function g(_, w, z, Z) {
      return w === null || w.tag !== 6 ? (w = Fc(z, _.mode, Z), w.return = _, w) : (w = i(w, z), w.return = _, w);
    }
    function x(_, w, z, Z) {
      var oe = z.type;
      return oe === C ? q(
        _,
        w,
        z.props.children,
        Z,
        z.key
      ) : w !== null && (w.elementType === oe || typeof oe == "object" && oe !== null && oe.$$typeof === ue && xl(oe) === w.type) ? (w = i(w, z.props), ka(w, z), w.return = _, w) : (w = ki(
        z.type,
        z.key,
        z.props,
        null,
        _.mode,
        Z
      ), ka(w, z), w.return = _, w);
    }
    function M(_, w, z, Z) {
      return w === null || w.tag !== 4 || w.stateNode.containerInfo !== z.containerInfo || w.stateNode.implementation !== z.implementation ? (w = Ic(z, _.mode, Z), w.return = _, w) : (w = i(w, z.children || []), w.return = _, w);
    }
    function q(_, w, z, Z, oe) {
      return w === null || w.tag !== 7 ? (w = gl(
        z,
        _.mode,
        Z,
        oe
      ), w.return = _, w) : (w = i(w, z), w.return = _, w);
    }
    function K(_, w, z) {
      if (typeof w == "string" && w !== "" || typeof w == "number" || typeof w == "bigint")
        return w = Fc(
          "" + w,
          _.mode,
          z
        ), w.return = _, w;
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case D:
            return z = ki(
              w.type,
              w.key,
              w.props,
              null,
              _.mode,
              z
            ), ka(z, w), z.return = _, z;
          case S:
            return w = Ic(
              w,
              _.mode,
              z
            ), w.return = _, w;
          case ue:
            return w = xl(w), K(_, w, z);
        }
        if (V(w) || ve(w))
          return w = gl(
            w,
            _.mode,
            z,
            null
          ), w.return = _, w;
        if (typeof w.then == "function")
          return K(_, eu(w), z);
        if (w.$$typeof === Y)
          return K(
            _,
            $i(_, w),
            z
          );
        tu(_, w);
      }
      return null;
    }
    function N(_, w, z, Z) {
      var oe = w !== null ? w.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint")
        return oe !== null ? null : g(_, w, "" + z, Z);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case D:
            return z.key === oe ? x(_, w, z, Z) : null;
          case S:
            return z.key === oe ? M(_, w, z, Z) : null;
          case ue:
            return z = xl(z), N(_, w, z, Z);
        }
        if (V(z) || ve(z))
          return oe !== null ? null : q(_, w, z, Z, null);
        if (typeof z.then == "function")
          return N(
            _,
            w,
            eu(z),
            Z
          );
        if (z.$$typeof === Y)
          return N(
            _,
            w,
            $i(_, z),
            Z
          );
        tu(_, z);
      }
      return null;
    }
    function H(_, w, z, Z, oe) {
      if (typeof Z == "string" && Z !== "" || typeof Z == "number" || typeof Z == "bigint")
        return _ = _.get(z) || null, g(w, _, "" + Z, oe);
      if (typeof Z == "object" && Z !== null) {
        switch (Z.$$typeof) {
          case D:
            return _ = _.get(
              Z.key === null ? z : Z.key
            ) || null, x(w, _, Z, oe);
          case S:
            return _ = _.get(
              Z.key === null ? z : Z.key
            ) || null, M(w, _, Z, oe);
          case ue:
            return Z = xl(Z), H(
              _,
              w,
              z,
              Z,
              oe
            );
        }
        if (V(Z) || ve(Z))
          return _ = _.get(z) || null, q(w, _, Z, oe, null);
        if (typeof Z.then == "function")
          return H(
            _,
            w,
            z,
            eu(Z),
            oe
          );
        if (Z.$$typeof === Y)
          return H(
            _,
            w,
            z,
            $i(w, Z),
            oe
          );
        tu(w, Z);
      }
      return null;
    }
    function ee(_, w, z, Z) {
      for (var oe = null, Re = null, ie = w, Se = w = 0, Oe = null; ie !== null && Se < z.length; Se++) {
        ie.index > Se ? (Oe = ie, ie = null) : Oe = ie.sibling;
        var ze = N(
          _,
          ie,
          z[Se],
          Z
        );
        if (ze === null) {
          ie === null && (ie = Oe);
          break;
        }
        e && ie && ze.alternate === null && t(_, ie), w = u(ze, w, Se), Re === null ? oe = ze : Re.sibling = ze, Re = ze, ie = Oe;
      }
      if (Se === z.length)
        return n(_, ie), _e && fn(_, Se), oe;
      if (ie === null) {
        for (; Se < z.length; Se++)
          ie = K(_, z[Se], Z), ie !== null && (w = u(
            ie,
            w,
            Se
          ), Re === null ? oe = ie : Re.sibling = ie, Re = ie);
        return _e && fn(_, Se), oe;
      }
      for (ie = l(ie); Se < z.length; Se++)
        Oe = H(
          ie,
          _,
          Se,
          z[Se],
          Z
        ), Oe !== null && (e && Oe.alternate !== null && ie.delete(
          Oe.key === null ? Se : Oe.key
        ), w = u(
          Oe,
          w,
          Se
        ), Re === null ? oe = Oe : Re.sibling = Oe, Re = Oe);
      return e && ie.forEach(function(Pn) {
        return t(_, Pn);
      }), _e && fn(_, Se), oe;
    }
    function fe(_, w, z, Z) {
      if (z == null) throw Error(s(151));
      for (var oe = null, Re = null, ie = w, Se = w = 0, Oe = null, ze = z.next(); ie !== null && !ze.done; Se++, ze = z.next()) {
        ie.index > Se ? (Oe = ie, ie = null) : Oe = ie.sibling;
        var Pn = N(_, ie, ze.value, Z);
        if (Pn === null) {
          ie === null && (ie = Oe);
          break;
        }
        e && ie && Pn.alternate === null && t(_, ie), w = u(Pn, w, Se), Re === null ? oe = Pn : Re.sibling = Pn, Re = Pn, ie = Oe;
      }
      if (ze.done)
        return n(_, ie), _e && fn(_, Se), oe;
      if (ie === null) {
        for (; !ze.done; Se++, ze = z.next())
          ze = K(_, ze.value, Z), ze !== null && (w = u(ze, w, Se), Re === null ? oe = ze : Re.sibling = ze, Re = ze);
        return _e && fn(_, Se), oe;
      }
      for (ie = l(ie); !ze.done; Se++, ze = z.next())
        ze = H(ie, _, Se, ze.value, Z), ze !== null && (e && ze.alternate !== null && ie.delete(ze.key === null ? Se : ze.key), w = u(ze, w, Se), Re === null ? oe = ze : Re.sibling = ze, Re = ze);
      return e && ie.forEach(function(Eb) {
        return t(_, Eb);
      }), _e && fn(_, Se), oe;
    }
    function He(_, w, z, Z) {
      if (typeof z == "object" && z !== null && z.type === C && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case D:
            e: {
              for (var oe = z.key; w !== null; ) {
                if (w.key === oe) {
                  if (oe = z.type, oe === C) {
                    if (w.tag === 7) {
                      n(
                        _,
                        w.sibling
                      ), Z = i(
                        w,
                        z.props.children
                      ), Z.return = _, _ = Z;
                      break e;
                    }
                  } else if (w.elementType === oe || typeof oe == "object" && oe !== null && oe.$$typeof === ue && xl(oe) === w.type) {
                    n(
                      _,
                      w.sibling
                    ), Z = i(w, z.props), ka(Z, z), Z.return = _, _ = Z;
                    break e;
                  }
                  n(_, w);
                  break;
                } else t(_, w);
                w = w.sibling;
              }
              z.type === C ? (Z = gl(
                z.props.children,
                _.mode,
                Z,
                z.key
              ), Z.return = _, _ = Z) : (Z = ki(
                z.type,
                z.key,
                z.props,
                null,
                _.mode,
                Z
              ), ka(Z, z), Z.return = _, _ = Z);
            }
            return f(_);
          case S:
            e: {
              for (oe = z.key; w !== null; ) {
                if (w.key === oe)
                  if (w.tag === 4 && w.stateNode.containerInfo === z.containerInfo && w.stateNode.implementation === z.implementation) {
                    n(
                      _,
                      w.sibling
                    ), Z = i(w, z.children || []), Z.return = _, _ = Z;
                    break e;
                  } else {
                    n(_, w);
                    break;
                  }
                else t(_, w);
                w = w.sibling;
              }
              Z = Ic(z, _.mode, Z), Z.return = _, _ = Z;
            }
            return f(_);
          case ue:
            return z = xl(z), He(
              _,
              w,
              z,
              Z
            );
        }
        if (V(z))
          return ee(
            _,
            w,
            z,
            Z
          );
        if (ve(z)) {
          if (oe = ve(z), typeof oe != "function") throw Error(s(150));
          return z = oe.call(z), fe(
            _,
            w,
            z,
            Z
          );
        }
        if (typeof z.then == "function")
          return He(
            _,
            w,
            eu(z),
            Z
          );
        if (z.$$typeof === Y)
          return He(
            _,
            w,
            $i(_, z),
            Z
          );
        tu(_, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint" ? (z = "" + z, w !== null && w.tag === 6 ? (n(_, w.sibling), Z = i(w, z), Z.return = _, _ = Z) : (n(_, w), Z = Fc(z, _.mode, Z), Z.return = _, _ = Z), f(_)) : n(_, w);
    }
    return function(_, w, z, Z) {
      try {
        Ka = 0;
        var oe = He(
          _,
          w,
          z,
          Z
        );
        return na = null, oe;
      } catch (ie) {
        if (ie === ta || ie === Ii) throw ie;
        var Re = wt(29, ie, null, _.mode);
        return Re.lanes = Z, Re.return = _, Re;
      } finally {
      }
    };
  }
  var Al = Gf(!0), Vf = Gf(!1), Hn = !1;
  function so(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function fo(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Ln(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Bn(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (Me & 2) !== 0) {
      var i = l.pending;
      return i === null ? t.next = t : (t.next = i.next, i.next = t), l.pending = t, t = Ki(e), wf(e, null, n), t;
    }
    return Zi(e, l, t, n), Ki(e);
  }
  function Ja(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Ns(e, n);
    }
  }
  function mo(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var i = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var f = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? i = u = f : u = u.next = f, n = n.next;
        } while (n !== null);
        u === null ? i = u = t : u = u.next = t;
      } else i = u = t;
      n = {
        baseState: l.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: u,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var ho = !1;
  function Wa() {
    if (ho) {
      var e = ea;
      if (e !== null) throw e;
    }
  }
  function $a(e, t, n, l) {
    ho = !1;
    var i = e.updateQueue;
    Hn = !1;
    var u = i.firstBaseUpdate, f = i.lastBaseUpdate, g = i.shared.pending;
    if (g !== null) {
      i.shared.pending = null;
      var x = g, M = x.next;
      x.next = null, f === null ? u = M : f.next = M, f = x;
      var q = e.alternate;
      q !== null && (q = q.updateQueue, g = q.lastBaseUpdate, g !== f && (g === null ? q.firstBaseUpdate = M : g.next = M, q.lastBaseUpdate = x));
    }
    if (u !== null) {
      var K = i.baseState;
      f = 0, q = M = x = null, g = u;
      do {
        var N = g.lane & -536870913, H = N !== g.lane;
        if (H ? (Ce & N) === N : (l & N) === N) {
          N !== 0 && N === Pl && (ho = !0), q !== null && (q = q.next = {
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: null,
            next: null
          });
          e: {
            var ee = e, fe = g;
            N = t;
            var He = n;
            switch (fe.tag) {
              case 1:
                if (ee = fe.payload, typeof ee == "function") {
                  K = ee.call(He, K, N);
                  break e;
                }
                K = ee;
                break e;
              case 3:
                ee.flags = ee.flags & -65537 | 128;
              case 0:
                if (ee = fe.payload, N = typeof ee == "function" ? ee.call(He, K, N) : ee, N == null) break e;
                K = A({}, K, N);
                break e;
              case 2:
                Hn = !0;
            }
          }
          N = g.callback, N !== null && (e.flags |= 64, H && (e.flags |= 8192), H = i.callbacks, H === null ? i.callbacks = [N] : H.push(N));
        } else
          H = {
            lane: N,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, q === null ? (M = q = H, x = K) : q = q.next = H, f |= N;
        if (g = g.next, g === null) {
          if (g = i.shared.pending, g === null)
            break;
          H = g, g = H.next, H.next = null, i.lastBaseUpdate = H, i.shared.pending = null;
        }
      } while (!0);
      q === null && (x = K), i.baseState = x, i.firstBaseUpdate = M, i.lastBaseUpdate = q, u === null && (i.shared.lanes = 0), Xn |= f, e.lanes = f, e.memoizedState = K;
    }
  }
  function Xf(e, t) {
    if (typeof e != "function")
      throw Error(s(191, e));
    e.call(t);
  }
  function Qf(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        Xf(n[e], t);
  }
  var la = T(null), nu = T(0);
  function Zf(e, t) {
    e = En, $(nu, e), $(la, t), En = e | t.baseLanes;
  }
  function vo() {
    $(nu, En), $(la, la.current);
  }
  function go() {
    En = nu.current, Q(la), Q(nu);
  }
  var Ct = T(null), qt = null;
  function Yn(e) {
    var t = e.alternate;
    $(Ze, Ze.current & 1), $(Ct, e), qt === null && (t === null || la.current !== null || t.memoizedState !== null) && (qt = e);
  }
  function po(e) {
    $(Ze, Ze.current), $(Ct, e), qt === null && (qt = e);
  }
  function Kf(e) {
    e.tag === 22 ? ($(Ze, Ze.current), $(Ct, e), qt === null && (qt = e)) : qn();
  }
  function qn() {
    $(Ze, Ze.current), $(Ct, Ct.current);
  }
  function Ot(e) {
    Q(Ct), qt === e && (qt = null), Q(Ze);
  }
  var Ze = T(0);
  function lu(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || Ar(n) || Tr(n)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var hn = 0, ye = null, Ue = null, We = null, au = !1, aa = !1, Tl = !1, iu = 0, Fa = 0, ia = null, dy = 0;
  function Ve() {
    throw Error(s(321));
  }
  function yo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Tt(e[n], t[n])) return !1;
    return !0;
  }
  function bo(e, t, n, l, i, u) {
    return hn = u, ye = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, B.H = e === null || e.memoizedState === null ? Rd : Uo, Tl = !1, u = n(l, i), Tl = !1, aa && (u = Jf(
      t,
      n,
      l,
      i
    )), kf(e), u;
  }
  function kf(e) {
    B.H = ei;
    var t = Ue !== null && Ue.next !== null;
    if (hn = 0, We = Ue = ye = null, au = !1, Fa = 0, ia = null, t) throw Error(s(300));
    e === null || $e || (e = e.dependencies, e !== null && Wi(e) && ($e = !0));
  }
  function Jf(e, t, n, l) {
    ye = e;
    var i = 0;
    do {
      if (aa && (ia = null), Fa = 0, aa = !1, 25 <= i) throw Error(s(301));
      if (i += 1, We = Ue = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      B.H = zd, u = t(n, l);
    } while (aa);
    return u;
  }
  function my() {
    var e = B.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Ia(t) : t, e = e.useState()[0], (Ue !== null ? Ue.memoizedState : null) !== e && (ye.flags |= 1024), t;
  }
  function So() {
    var e = iu !== 0;
    return iu = 0, e;
  }
  function xo(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function Eo(e) {
    if (au) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      au = !1;
    }
    hn = 0, We = Ue = ye = null, aa = !1, Fa = iu = 0, ia = null;
  }
  function ft() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return We === null ? ye.memoizedState = We = e : We = We.next = e, We;
  }
  function Ke() {
    if (Ue === null) {
      var e = ye.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ue.next;
    var t = We === null ? ye.memoizedState : We.next;
    if (t !== null)
      We = t, Ue = e;
    else {
      if (e === null)
        throw ye.alternate === null ? Error(s(467)) : Error(s(310));
      Ue = e, e = {
        memoizedState: Ue.memoizedState,
        baseState: Ue.baseState,
        baseQueue: Ue.baseQueue,
        queue: Ue.queue,
        next: null
      }, We === null ? ye.memoizedState = We = e : We = We.next = e;
    }
    return We;
  }
  function uu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ia(e) {
    var t = Fa;
    return Fa += 1, ia === null && (ia = []), e = Bf(ia, e, t), t = ye, (We === null ? t.memoizedState : We.next) === null && (t = t.alternate, B.H = t === null || t.memoizedState === null ? Rd : Uo), e;
  }
  function cu(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Ia(e);
      if (e.$$typeof === Y) return ut(e);
    }
    throw Error(s(438, String(e)));
  }
  function Ao(e) {
    var t = null, n = ye.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = ye.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(i) {
          return i.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = uu(), ye.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = be;
    return t.index++, n;
  }
  function vn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ou(e) {
    var t = Ke();
    return To(t, Ue, e);
  }
  function To(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(s(311));
    l.lastRenderedReducer = n;
    var i = e.baseQueue, u = l.pending;
    if (u !== null) {
      if (i !== null) {
        var f = i.next;
        i.next = u.next, u.next = f;
      }
      t.baseQueue = i = u, l.pending = null;
    }
    if (u = e.baseState, i === null) e.memoizedState = u;
    else {
      t = i.next;
      var g = f = null, x = null, M = t, q = !1;
      do {
        var K = M.lane & -536870913;
        if (K !== M.lane ? (Ce & K) === K : (hn & K) === K) {
          var N = M.revertLane;
          if (N === 0)
            x !== null && (x = x.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: M.action,
              hasEagerState: M.hasEagerState,
              eagerState: M.eagerState,
              next: null
            }), K === Pl && (q = !0);
          else if ((hn & N) === N) {
            M = M.next, N === Pl && (q = !0);
            continue;
          } else
            K = {
              lane: 0,
              revertLane: M.revertLane,
              gesture: null,
              action: M.action,
              hasEagerState: M.hasEagerState,
              eagerState: M.eagerState,
              next: null
            }, x === null ? (g = x = K, f = u) : x = x.next = K, ye.lanes |= N, Xn |= N;
          K = M.action, Tl && n(u, K), u = M.hasEagerState ? M.eagerState : n(u, K);
        } else
          N = {
            lane: K,
            revertLane: M.revertLane,
            gesture: M.gesture,
            action: M.action,
            hasEagerState: M.hasEagerState,
            eagerState: M.eagerState,
            next: null
          }, x === null ? (g = x = N, f = u) : x = x.next = N, ye.lanes |= K, Xn |= K;
        M = M.next;
      } while (M !== null && M !== t);
      if (x === null ? f = u : x.next = g, !Tt(u, e.memoizedState) && ($e = !0, q && (n = ea, n !== null)))
        throw n;
      e.memoizedState = u, e.baseState = f, e.baseQueue = x, l.lastRenderedState = u;
    }
    return i === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function wo(e) {
    var t = Ke(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, i = n.pending, u = t.memoizedState;
    if (i !== null) {
      n.pending = null;
      var f = i = i.next;
      do
        u = e(u, f.action), f = f.next;
      while (f !== i);
      Tt(u, t.memoizedState) || ($e = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, l];
  }
  function Wf(e, t, n) {
    var l = ye, i = Ke(), u = _e;
    if (u) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else n = t();
    var f = !Tt(
      (Ue || i).memoizedState,
      n
    );
    if (f && (i.memoizedState = n, $e = !0), i = i.queue, _o(If.bind(null, l, i, e), [
      e
    ]), i.getSnapshot !== t || f || We !== null && We.memoizedState.tag & 1) {
      if (l.flags |= 2048, ua(
        9,
        { destroy: void 0 },
        Ff.bind(
          null,
          l,
          i,
          n,
          t
        ),
        null
      ), Le === null) throw Error(s(349));
      u || (hn & 127) !== 0 || $f(l, t, n);
    }
    return n;
  }
  function $f(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ye.updateQueue, t === null ? (t = uu(), ye.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ff(e, t, n, l) {
    t.value = n, t.getSnapshot = l, Pf(t) && ed(e);
  }
  function If(e, t, n) {
    return n(function() {
      Pf(t) && ed(e);
    });
  }
  function Pf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Tt(e, n);
    } catch {
      return !0;
    }
  }
  function ed(e) {
    var t = vl(e, 2);
    t !== null && yt(t, e, 2);
  }
  function Co(e) {
    var t = ft();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), Tl) {
        Rn(!0);
        try {
          n();
        } finally {
          Rn(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: vn,
      lastRenderedState: e
    }, t;
  }
  function td(e, t, n, l) {
    return e.baseState = n, To(
      e,
      Ue,
      typeof l == "function" ? l : vn
    );
  }
  function hy(e, t, n, l, i) {
    if (fu(e)) throw Error(s(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: i,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          u.listeners.push(f);
        }
      };
      B.T !== null ? n(!0) : u.isTransition = !1, l(u), n = t.pending, n === null ? (u.next = t.pending = u, nd(t, u)) : (u.next = n.next, t.pending = n.next = u);
    }
  }
  function nd(e, t) {
    var n = t.action, l = t.payload, i = e.state;
    if (t.isTransition) {
      var u = B.T, f = {};
      B.T = f;
      try {
        var g = n(i, l), x = B.S;
        x !== null && x(f, g), ld(e, t, g);
      } catch (M) {
        Oo(e, t, M);
      } finally {
        u !== null && f.types !== null && (u.types = f.types), B.T = u;
      }
    } else
      try {
        u = n(i, l), ld(e, t, u);
      } catch (M) {
        Oo(e, t, M);
      }
  }
  function ld(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        ad(e, t, l);
      },
      function(l) {
        return Oo(e, t, l);
      }
    ) : ad(e, t, n);
  }
  function ad(e, t, n) {
    t.status = "fulfilled", t.value = n, id(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, nd(e, n)));
  }
  function Oo(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, id(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function id(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function ud(e, t) {
    return t;
  }
  function cd(e, t) {
    if (_e) {
      var n = Le.formState;
      if (n !== null) {
        e: {
          var l = ye;
          if (_e) {
            if (Ye) {
              t: {
                for (var i = Ye, u = Yt; i.nodeType !== 8; ) {
                  if (!u) {
                    i = null;
                    break t;
                  }
                  if (i = Gt(
                    i.nextSibling
                  ), i === null) {
                    i = null;
                    break t;
                  }
                }
                u = i.data, i = u === "F!" || u === "F" ? i : null;
              }
              if (i) {
                Ye = Gt(
                  i.nextSibling
                ), l = i.data === "F!";
                break e;
              }
            }
            Un(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return n = ft(), n.memoizedState = n.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ud,
      lastRenderedState: t
    }, n.queue = l, n = Cd.bind(
      null,
      ye,
      l
    ), l.dispatch = n, l = Co(!1), u = Do.bind(
      null,
      ye,
      !1,
      l.queue
    ), l = ft(), i = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = i, n = hy.bind(
      null,
      ye,
      i,
      u,
      n
    ), i.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function od(e) {
    var t = Ke();
    return rd(t, Ue, e);
  }
  function rd(e, t, n) {
    if (t = To(
      e,
      t,
      ud
    )[0], e = ou(vn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = Ia(t);
      } catch (f) {
        throw f === ta ? Ii : f;
      }
    else l = t;
    t = Ke();
    var i = t.queue, u = i.dispatch;
    return n !== t.memoizedState && (ye.flags |= 2048, ua(
      9,
      { destroy: void 0 },
      vy.bind(null, i, n),
      null
    )), [l, u, e];
  }
  function vy(e, t) {
    e.action = t;
  }
  function sd(e) {
    var t = Ke(), n = Ue;
    if (n !== null)
      return rd(t, n, e);
    Ke(), t = t.memoizedState, n = Ke();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function ua(e, t, n, l) {
    return e = { tag: e, create: n, deps: l, inst: t, next: null }, t = ye.updateQueue, t === null && (t = uu(), ye.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function fd() {
    return Ke().memoizedState;
  }
  function ru(e, t, n, l) {
    var i = ft();
    ye.flags |= e, i.memoizedState = ua(
      1 | t,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function su(e, t, n, l) {
    var i = Ke();
    l = l === void 0 ? null : l;
    var u = i.memoizedState.inst;
    Ue !== null && l !== null && yo(l, Ue.memoizedState.deps) ? i.memoizedState = ua(t, u, n, l) : (ye.flags |= e, i.memoizedState = ua(
      1 | t,
      u,
      n,
      l
    ));
  }
  function dd(e, t) {
    ru(8390656, 8, e, t);
  }
  function _o(e, t) {
    su(2048, 8, e, t);
  }
  function gy(e) {
    ye.flags |= 4;
    var t = ye.updateQueue;
    if (t === null)
      t = uu(), ye.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function md(e) {
    var t = Ke().memoizedState;
    return gy({ ref: t, nextImpl: e }), function() {
      if ((Me & 2) !== 0) throw Error(s(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function hd(e, t) {
    return su(4, 2, e, t);
  }
  function vd(e, t) {
    return su(4, 4, e, t);
  }
  function gd(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function() {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function pd(e, t, n) {
    n = n != null ? n.concat([e]) : null, su(4, 4, gd.bind(null, t, e), n);
  }
  function Ro() {
  }
  function yd(e, t) {
    var n = Ke();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && yo(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function bd(e, t) {
    var n = Ke();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && yo(t, l[1]))
      return l[0];
    if (l = e(), Tl) {
      Rn(!0);
      try {
        e();
      } finally {
        Rn(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function zo(e, t, n) {
    return n === void 0 || (hn & 1073741824) !== 0 && (Ce & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = Sm(), ye.lanes |= e, Xn |= e, n);
  }
  function Sd(e, t, n, l) {
    return Tt(n, t) ? n : la.current !== null ? (e = zo(e, n, l), Tt(e, t) || ($e = !0), e) : (hn & 42) === 0 || (hn & 1073741824) !== 0 && (Ce & 261930) === 0 ? ($e = !0, e.memoizedState = n) : (e = Sm(), ye.lanes |= e, Xn |= e, t);
  }
  function xd(e, t, n, l, i) {
    var u = G.p;
    G.p = u !== 0 && 8 > u ? u : 8;
    var f = B.T, g = {};
    B.T = g, Do(e, !1, t, n);
    try {
      var x = i(), M = B.S;
      if (M !== null && M(g, x), x !== null && typeof x == "object" && typeof x.then == "function") {
        var q = fy(
          x,
          l
        );
        Pa(
          e,
          t,
          q,
          zt(e)
        );
      } else
        Pa(
          e,
          t,
          l,
          zt(e)
        );
    } catch (K) {
      Pa(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: K },
        zt()
      );
    } finally {
      G.p = u, f !== null && g.types !== null && (f.types = g.types), B.T = f;
    }
  }
  function py() {
  }
  function Mo(e, t, n, l) {
    if (e.tag !== 5) throw Error(s(476));
    var i = Ed(e).queue;
    xd(
      e,
      i,
      t,
      le,
      n === null ? py : function() {
        return Ad(e), n(l);
      }
    );
  }
  function Ed(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: le,
      baseState: le,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: vn,
        lastRenderedState: le
      },
      next: null
    };
    var n = {};
    return t.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: vn,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Ad(e) {
    var t = Ed(e);
    t.next === null && (t = e.alternate.memoizedState), Pa(
      e,
      t.next.queue,
      {},
      zt()
    );
  }
  function No() {
    return ut(gi);
  }
  function Td() {
    return Ke().memoizedState;
  }
  function wd() {
    return Ke().memoizedState;
  }
  function yy(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = zt();
          e = Ln(n);
          var l = Bn(t, e, n);
          l !== null && (yt(l, t, n), Ja(l, t, n)), t = { cache: uo() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function by(e, t, n) {
    var l = zt();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, fu(e) ? Od(t, n) : (n = Wc(e, t, n, l), n !== null && (yt(n, e, l), _d(n, t, l)));
  }
  function Cd(e, t, n) {
    var l = zt();
    Pa(e, t, n, l);
  }
  function Pa(e, t, n, l) {
    var i = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (fu(e)) Od(t, i);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var f = t.lastRenderedState, g = u(f, n);
          if (i.hasEagerState = !0, i.eagerState = g, Tt(g, f))
            return Zi(e, t, i, 0), Le === null && Qi(), !1;
        } catch {
        } finally {
        }
      if (n = Wc(e, t, i, l), n !== null)
        return yt(n, e, l), _d(n, t, l), !0;
    }
    return !1;
  }
  function Do(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: fr(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, fu(e)) {
      if (t) throw Error(s(479));
    } else
      t = Wc(
        e,
        n,
        l,
        2
      ), t !== null && yt(t, e, 2);
  }
  function fu(e) {
    var t = e.alternate;
    return e === ye || t !== null && t === ye;
  }
  function Od(e, t) {
    aa = au = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function _d(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Ns(e, n);
    }
  }
  var ei = {
    readContext: ut,
    use: cu,
    useCallback: Ve,
    useContext: Ve,
    useEffect: Ve,
    useImperativeHandle: Ve,
    useLayoutEffect: Ve,
    useInsertionEffect: Ve,
    useMemo: Ve,
    useReducer: Ve,
    useRef: Ve,
    useState: Ve,
    useDebugValue: Ve,
    useDeferredValue: Ve,
    useTransition: Ve,
    useSyncExternalStore: Ve,
    useId: Ve,
    useHostTransitionStatus: Ve,
    useFormState: Ve,
    useActionState: Ve,
    useOptimistic: Ve,
    useMemoCache: Ve,
    useCacheRefresh: Ve
  };
  ei.useEffectEvent = Ve;
  var Rd = {
    readContext: ut,
    use: cu,
    useCallback: function(e, t) {
      return ft().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ut,
    useEffect: dd,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, ru(
        4194308,
        4,
        gd.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return ru(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ru(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = ft();
      t = t === void 0 ? null : t;
      var l = e();
      if (Tl) {
        Rn(!0);
        try {
          e();
        } finally {
          Rn(!1);
        }
      }
      return n.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, n) {
      var l = ft();
      if (n !== void 0) {
        var i = n(t);
        if (Tl) {
          Rn(!0);
          try {
            n(t);
          } finally {
            Rn(!1);
          }
        }
      } else i = t;
      return l.memoizedState = l.baseState = i, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: i
      }, l.queue = e, e = e.dispatch = by.bind(
        null,
        ye,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = ft();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Co(e);
      var t = e.queue, n = Cd.bind(null, ye, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: Ro,
    useDeferredValue: function(e, t) {
      var n = ft();
      return zo(n, e, t);
    },
    useTransition: function() {
      var e = Co(!1);
      return e = xd.bind(
        null,
        ye,
        e.queue,
        !0,
        !1
      ), ft().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = ye, i = ft();
      if (_e) {
        if (n === void 0)
          throw Error(s(407));
        n = n();
      } else {
        if (n = t(), Le === null)
          throw Error(s(349));
        (Ce & 127) !== 0 || $f(l, t, n);
      }
      i.memoizedState = n;
      var u = { value: n, getSnapshot: t };
      return i.queue = u, dd(If.bind(null, l, u, e), [
        e
      ]), l.flags |= 2048, ua(
        9,
        { destroy: void 0 },
        Ff.bind(
          null,
          l,
          u,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = ft(), t = Le.identifierPrefix;
      if (_e) {
        var n = $t, l = Wt;
        n = (l & ~(1 << 32 - At(l) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = iu++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = dy++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: No,
    useFormState: cd,
    useActionState: cd,
    useOptimistic: function(e) {
      var t = ft();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = Do.bind(
        null,
        ye,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: Ao,
    useCacheRefresh: function() {
      return ft().memoizedState = yy.bind(
        null,
        ye
      );
    },
    useEffectEvent: function(e) {
      var t = ft(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((Me & 2) !== 0)
          throw Error(s(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Uo = {
    readContext: ut,
    use: cu,
    useCallback: yd,
    useContext: ut,
    useEffect: _o,
    useImperativeHandle: pd,
    useInsertionEffect: hd,
    useLayoutEffect: vd,
    useMemo: bd,
    useReducer: ou,
    useRef: fd,
    useState: function() {
      return ou(vn);
    },
    useDebugValue: Ro,
    useDeferredValue: function(e, t) {
      var n = Ke();
      return Sd(
        n,
        Ue.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ou(vn)[0], t = Ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Ia(e),
        t
      ];
    },
    useSyncExternalStore: Wf,
    useId: Td,
    useHostTransitionStatus: No,
    useFormState: od,
    useActionState: od,
    useOptimistic: function(e, t) {
      var n = Ke();
      return td(n, Ue, e, t);
    },
    useMemoCache: Ao,
    useCacheRefresh: wd
  };
  Uo.useEffectEvent = md;
  var zd = {
    readContext: ut,
    use: cu,
    useCallback: yd,
    useContext: ut,
    useEffect: _o,
    useImperativeHandle: pd,
    useInsertionEffect: hd,
    useLayoutEffect: vd,
    useMemo: bd,
    useReducer: wo,
    useRef: fd,
    useState: function() {
      return wo(vn);
    },
    useDebugValue: Ro,
    useDeferredValue: function(e, t) {
      var n = Ke();
      return Ue === null ? zo(n, e, t) : Sd(
        n,
        Ue.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = wo(vn)[0], t = Ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Ia(e),
        t
      ];
    },
    useSyncExternalStore: Wf,
    useId: Td,
    useHostTransitionStatus: No,
    useFormState: sd,
    useActionState: sd,
    useOptimistic: function(e, t) {
      var n = Ke();
      return Ue !== null ? td(n, Ue, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: Ao,
    useCacheRefresh: wd
  };
  zd.useEffectEvent = md;
  function jo(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : A({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Ho = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = zt(), i = Ln(l);
      i.payload = t, n != null && (i.callback = n), t = Bn(e, i, l), t !== null && (yt(t, e, l), Ja(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = zt(), i = Ln(l);
      i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Bn(e, i, l), t !== null && (yt(t, e, l), Ja(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = zt(), l = Ln(n);
      l.tag = 2, t != null && (l.callback = t), t = Bn(e, l, n), t !== null && (yt(t, e, n), Ja(t, e, n));
    }
  };
  function Md(e, t, n, l, i, u, f) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, u, f) : t.prototype && t.prototype.isPureReactComponent ? !qa(n, l) || !qa(i, u) : !0;
  }
  function Nd(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && Ho.enqueueReplaceState(t, t.state, null);
  }
  function wl(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t)
        l !== "ref" && (n[l] = t[l]);
    }
    if (e = e.defaultProps) {
      n === t && (n = A({}, n));
      for (var i in e)
        n[i] === void 0 && (n[i] = e[i]);
    }
    return n;
  }
  function Dd(e) {
    Xi(e);
  }
  function Ud(e) {
    console.error(e);
  }
  function jd(e) {
    Xi(e);
  }
  function du(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function Hd(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function Lo(e, t, n) {
    return n = Ln(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      du(e, t);
    }, n;
  }
  function Ld(e) {
    return e = Ln(e), e.tag = 3, e;
  }
  function Bd(e, t, n, l) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var u = l.value;
      e.payload = function() {
        return i(u);
      }, e.callback = function() {
        Hd(t, n, l);
      };
    }
    var f = n.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (e.callback = function() {
      Hd(t, n, l), typeof i != "function" && (Qn === null ? Qn = /* @__PURE__ */ new Set([this]) : Qn.add(this));
      var g = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: g !== null ? g : ""
      });
    });
  }
  function Sy(e, t, n, l, i) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && Il(
        t,
        n,
        i,
        !0
      ), n = Ct.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return qt === null ? Tu() : n.alternate === null && Xe === 0 && (Xe = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, l === Pi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), or(e, l, i)), !1;
          case 22:
            return n.flags |= 65536, l === Pi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), or(e, l, i)), !1;
        }
        throw Error(s(435, n.tag));
      }
      return or(e, l, i), Tu(), !1;
    }
    if (_e)
      return t = Ct.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = i, l !== to && (e = Error(s(422), { cause: l }), Xa(Ht(e, n)))) : (l !== to && (t = Error(s(423), {
        cause: l
      }), Xa(
        Ht(t, n)
      )), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, l = Ht(l, n), i = Lo(
        e.stateNode,
        l,
        i
      ), mo(e, i), Xe !== 4 && (Xe = 2)), !1;
    var u = Error(s(520), { cause: l });
    if (u = Ht(u, n), oi === null ? oi = [u] : oi.push(u), Xe !== 4 && (Xe = 2), t === null) return !0;
    l = Ht(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = i & -i, n.lanes |= e, e = Lo(n.stateNode, l, e), mo(n, e), !1;
        case 1:
          if (t = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Qn === null || !Qn.has(u))))
            return n.flags |= 65536, i &= -i, n.lanes |= i, i = Ld(i), Bd(
              i,
              e,
              n,
              l
            ), mo(n, i), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Bo = Error(s(461)), $e = !1;
  function ct(e, t, n, l) {
    t.child = e === null ? Vf(t, null, n, l) : Al(
      t,
      e.child,
      n,
      l
    );
  }
  function Yd(e, t, n, l, i) {
    n = n.render;
    var u = t.ref;
    if ("ref" in l) {
      var f = {};
      for (var g in l)
        g !== "ref" && (f[g] = l[g]);
    } else f = l;
    return bl(t), l = bo(
      e,
      t,
      n,
      f,
      u,
      i
    ), g = So(), e !== null && !$e ? (xo(e, t, i), gn(e, t, i)) : (_e && g && Pc(t), t.flags |= 1, ct(e, t, l, i), t.child);
  }
  function qd(e, t, n, l, i) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !$c(u) && u.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = u, Gd(
        e,
        t,
        u,
        l,
        i
      )) : (e = ki(
        n.type,
        null,
        l,
        t,
        t.mode,
        i
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Ko(e, i)) {
      var f = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : qa, n(f, l) && e.ref === t.ref)
        return gn(e, t, i);
    }
    return t.flags |= 1, e = sn(u, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Gd(e, t, n, l, i) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (qa(u, l) && e.ref === t.ref)
        if ($e = !1, t.pendingProps = l = u, Ko(e, i))
          (e.flags & 131072) !== 0 && ($e = !0);
        else
          return t.lanes = e.lanes, gn(e, t, i);
    }
    return Yo(
      e,
      t,
      n,
      l,
      i
    );
  }
  function Vd(e, t, n, l) {
    var i = l.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | n : n, e !== null) {
          for (l = t.child = e.child, i = 0; l !== null; )
            i = i | l.lanes | l.childLanes, l = l.sibling;
          l = i & ~u;
        } else l = 0, t.child = null;
        return Xd(
          e,
          t,
          u,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Fi(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Zf(t, u) : vo(), Kf(t);
      else
        return l = t.lanes = 536870912, Xd(
          e,
          t,
          u !== null ? u.baseLanes | n : n,
          n,
          l
        );
    } else
      u !== null ? (Fi(t, u.cachePool), Zf(t, u), qn(), t.memoizedState = null) : (e !== null && Fi(t, null), vo(), qn());
    return ct(e, t, i, n), t.child;
  }
  function ti(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Xd(e, t, n, l, i) {
    var u = oo();
    return u = u === null ? null : { parent: Je._currentValue, pool: u }, t.memoizedState = {
      baseLanes: n,
      cachePool: u
    }, e !== null && Fi(t, null), vo(), Kf(t), e !== null && Il(e, t, l, !0), t.childLanes = i, null;
  }
  function mu(e, t) {
    return t = vu(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Qd(e, t, n) {
    return Al(t, e.child, null, n), e = mu(t, t.pendingProps), e.flags |= 2, Ot(t), t.memoizedState = null, e;
  }
  function xy(e, t, n) {
    var l = t.pendingProps, i = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (_e) {
        if (l.mode === "hidden")
          return e = mu(t, l), t.lanes = 536870912, ti(null, e);
        if (po(t), (e = Ye) ? (e = nh(
          e,
          Yt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Nn !== null ? { id: Wt, overflow: $t } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Of(e), n.return = t, t.child = n, it = t, Ye = null)) : e = null, e === null) throw Un(t);
        return t.lanes = 536870912, null;
      }
      return mu(t, l);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var f = u.dehydrated;
      if (po(t), i)
        if (t.flags & 256)
          t.flags &= -257, t = Qd(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(s(558));
      else if ($e || Il(e, t, n, !1), i = (n & e.childLanes) !== 0, $e || i) {
        if (l = Le, l !== null && (f = Ds(l, n), f !== 0 && f !== u.retryLane))
          throw u.retryLane = f, vl(e, f), yt(l, e, f), Bo;
        Tu(), t = Qd(
          e,
          t,
          n
        );
      } else
        e = u.treeContext, Ye = Gt(f.nextSibling), it = t, _e = !0, Dn = null, Yt = !1, e !== null && zf(t, e), t = mu(t, l), t.flags |= 4096;
      return t;
    }
    return e = sn(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function hu(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(s(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Yo(e, t, n, l, i) {
    return bl(t), n = bo(
      e,
      t,
      n,
      l,
      void 0,
      i
    ), l = So(), e !== null && !$e ? (xo(e, t, i), gn(e, t, i)) : (_e && l && Pc(t), t.flags |= 1, ct(e, t, n, i), t.child);
  }
  function Zd(e, t, n, l, i, u) {
    return bl(t), t.updateQueue = null, n = Jf(
      t,
      l,
      n,
      i
    ), kf(e), l = So(), e !== null && !$e ? (xo(e, t, u), gn(e, t, u)) : (_e && l && Pc(t), t.flags |= 1, ct(e, t, n, u), t.child);
  }
  function Kd(e, t, n, l, i) {
    if (bl(t), t.stateNode === null) {
      var u = Jl, f = n.contextType;
      typeof f == "object" && f !== null && (u = ut(f)), u = new n(l, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Ho, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = l, u.state = t.memoizedState, u.refs = {}, so(t), f = n.contextType, u.context = typeof f == "object" && f !== null ? ut(f) : Jl, u.state = t.memoizedState, f = n.getDerivedStateFromProps, typeof f == "function" && (jo(
        t,
        n,
        f,
        l
      ), u.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (f = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), f !== u.state && Ho.enqueueReplaceState(u, u.state, null), $a(t, l, u, i), Wa(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      u = t.stateNode;
      var g = t.memoizedProps, x = wl(n, g);
      u.props = x;
      var M = u.context, q = n.contextType;
      f = Jl, typeof q == "object" && q !== null && (f = ut(q));
      var K = n.getDerivedStateFromProps;
      q = typeof K == "function" || typeof u.getSnapshotBeforeUpdate == "function", g = t.pendingProps !== g, q || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (g || M !== f) && Nd(
        t,
        u,
        l,
        f
      ), Hn = !1;
      var N = t.memoizedState;
      u.state = N, $a(t, l, u, i), Wa(), M = t.memoizedState, g || N !== M || Hn ? (typeof K == "function" && (jo(
        t,
        n,
        K,
        l
      ), M = t.memoizedState), (x = Hn || Md(
        t,
        n,
        x,
        l,
        N,
        M,
        f
      )) ? (q || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = M), u.props = l, u.state = M, u.context = f, l = x) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      u = t.stateNode, fo(e, t), f = t.memoizedProps, q = wl(n, f), u.props = q, K = t.pendingProps, N = u.context, M = n.contextType, x = Jl, typeof M == "object" && M !== null && (x = ut(M)), g = n.getDerivedStateFromProps, (M = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f !== K || N !== x) && Nd(
        t,
        u,
        l,
        x
      ), Hn = !1, N = t.memoizedState, u.state = N, $a(t, l, u, i), Wa();
      var H = t.memoizedState;
      f !== K || N !== H || Hn || e !== null && e.dependencies !== null && Wi(e.dependencies) ? (typeof g == "function" && (jo(
        t,
        n,
        g,
        l
      ), H = t.memoizedState), (q = Hn || Md(
        t,
        n,
        q,
        l,
        N,
        H,
        x
      ) || e !== null && e.dependencies !== null && Wi(e.dependencies)) ? (M || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(l, H, x), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        l,
        H,
        x
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = H), u.props = l, u.state = H, u.context = x, l = q) : (typeof u.componentDidUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && N === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return u = l, hu(e, t), l = (t.flags & 128) !== 0, u || l ? (u = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && l ? (t.child = Al(
      t,
      e.child,
      null,
      i
    ), t.child = Al(
      t,
      null,
      n,
      i
    )) : ct(e, t, n, i), t.memoizedState = u.state, e = t.child) : e = gn(
      e,
      t,
      i
    ), e;
  }
  function kd(e, t, n, l) {
    return pl(), t.flags |= 256, ct(e, t, n, l), t.child;
  }
  var qo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Go(e) {
    return { baseLanes: e, cachePool: Hf() };
  }
  function Vo(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= Rt), e;
  }
  function Jd(e, t, n) {
    var l = t.pendingProps, i = !1, u = (t.flags & 128) !== 0, f;
    if ((f = u) || (f = e !== null && e.memoizedState === null ? !1 : (Ze.current & 2) !== 0), f && (i = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (_e) {
        if (i ? Yn(t) : qn(), (e = Ye) ? (e = nh(
          e,
          Yt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Nn !== null ? { id: Wt, overflow: $t } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Of(e), n.return = t, t.child = n, it = t, Ye = null)) : e = null, e === null) throw Un(t);
        return Tr(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var g = l.children;
      return l = l.fallback, i ? (qn(), i = t.mode, g = vu(
        { mode: "hidden", children: g },
        i
      ), l = gl(
        l,
        i,
        n,
        null
      ), g.return = t, l.return = t, g.sibling = l, t.child = g, l = t.child, l.memoizedState = Go(n), l.childLanes = Vo(
        e,
        f,
        n
      ), t.memoizedState = qo, ti(null, l)) : (Yn(t), Xo(t, g));
    }
    var x = e.memoizedState;
    if (x !== null && (g = x.dehydrated, g !== null)) {
      if (u)
        t.flags & 256 ? (Yn(t), t.flags &= -257, t = Qo(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (qn(), t.child = e.child, t.flags |= 128, t = null) : (qn(), g = l.fallback, i = t.mode, l = vu(
          { mode: "visible", children: l.children },
          i
        ), g = gl(
          g,
          i,
          n,
          null
        ), g.flags |= 2, l.return = t, g.return = t, l.sibling = g, t.child = l, Al(
          t,
          e.child,
          null,
          n
        ), l = t.child, l.memoizedState = Go(n), l.childLanes = Vo(
          e,
          f,
          n
        ), t.memoizedState = qo, t = ti(null, l));
      else if (Yn(t), Tr(g)) {
        if (f = g.nextSibling && g.nextSibling.dataset, f) var M = f.dgst;
        f = M, l = Error(s(419)), l.stack = "", l.digest = f, Xa({ value: l, source: null, stack: null }), t = Qo(
          e,
          t,
          n
        );
      } else if ($e || Il(e, t, n, !1), f = (n & e.childLanes) !== 0, $e || f) {
        if (f = Le, f !== null && (l = Ds(f, n), l !== 0 && l !== x.retryLane))
          throw x.retryLane = l, vl(e, l), yt(f, e, l), Bo;
        Ar(g) || Tu(), t = Qo(
          e,
          t,
          n
        );
      } else
        Ar(g) ? (t.flags |= 192, t.child = e.child, t = null) : (e = x.treeContext, Ye = Gt(
          g.nextSibling
        ), it = t, _e = !0, Dn = null, Yt = !1, e !== null && zf(t, e), t = Xo(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return i ? (qn(), g = l.fallback, i = t.mode, x = e.child, M = x.sibling, l = sn(x, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = x.subtreeFlags & 65011712, M !== null ? g = sn(
      M,
      g
    ) : (g = gl(
      g,
      i,
      n,
      null
    ), g.flags |= 2), g.return = t, l.return = t, l.sibling = g, t.child = l, ti(null, l), l = t.child, g = e.child.memoizedState, g === null ? g = Go(n) : (i = g.cachePool, i !== null ? (x = Je._currentValue, i = i.parent !== x ? { parent: x, pool: x } : i) : i = Hf(), g = {
      baseLanes: g.baseLanes | n,
      cachePool: i
    }), l.memoizedState = g, l.childLanes = Vo(
      e,
      f,
      n
    ), t.memoizedState = qo, ti(e.child, l)) : (Yn(t), n = e.child, e = n.sibling, n = sn(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (f = t.deletions, f === null ? (t.deletions = [e], t.flags |= 16) : f.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Xo(e, t) {
    return t = vu(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function vu(e, t) {
    return e = wt(22, e, null, t), e.lanes = 0, e;
  }
  function Qo(e, t, n) {
    return Al(t, e.child, null, n), e = Xo(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Wd(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), ao(e.return, t, n);
  }
  function Zo(e, t, n, l, i, u) {
    var f = e.memoizedState;
    f === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: i,
      treeForkCount: u
    } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = l, f.tail = n, f.tailMode = i, f.treeForkCount = u);
  }
  function $d(e, t, n) {
    var l = t.pendingProps, i = l.revealOrder, u = l.tail;
    l = l.children;
    var f = Ze.current, g = (f & 2) !== 0;
    if (g ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, $(Ze, f), ct(e, t, l, n), l = _e ? Va : 0, !g && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Wd(e, n, t);
        else if (e.tag === 19)
          Wd(e, n, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (i) {
      case "forwards":
        for (n = t.child, i = null; n !== null; )
          e = n.alternate, e !== null && lu(e) === null && (i = n), n = n.sibling;
        n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Zo(
          t,
          !1,
          i,
          n,
          u,
          l
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (e = i.alternate, e !== null && lu(e) === null) {
            t.child = i;
            break;
          }
          e = i.sibling, i.sibling = n, n = i, i = e;
        }
        Zo(
          t,
          !0,
          n,
          null,
          u,
          l
        );
        break;
      case "together":
        Zo(
          t,
          !1,
          null,
          null,
          void 0,
          l
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function gn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Xn |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (Il(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = sn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = sn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Ko(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Wi(e)));
  }
  function Ey(e, t, n) {
    switch (t.tag) {
      case 3:
        re(t, t.stateNode.containerInfo), jn(t, Je, e.memoizedState.cache), pl();
        break;
      case 27:
      case 5:
        xe(t);
        break;
      case 4:
        re(t, t.stateNode.containerInfo);
        break;
      case 10:
        jn(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, po(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (Yn(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Jd(e, t, n) : (Yn(t), e = gn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        Yn(t);
        break;
      case 19:
        var i = (e.flags & 128) !== 0;
        if (l = (n & t.childLanes) !== 0, l || (Il(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), i) {
          if (l)
            return $d(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), $(Ze, Ze.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, Vd(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        jn(t, Je, e.memoizedState.cache);
    }
    return gn(e, t, n);
  }
  function Fd(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        $e = !0;
      else {
        if (!Ko(e, n) && (t.flags & 128) === 0)
          return $e = !1, Ey(
            e,
            t,
            n
          );
        $e = (e.flags & 131072) !== 0;
      }
    else
      $e = !1, _e && (t.flags & 1048576) !== 0 && Rf(t, Va, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = xl(t.elementType), t.type = e, typeof e == "function")
            $c(e) ? (l = wl(e, l), t.tag = 1, t = Kd(
              null,
              t,
              e,
              l,
              n
            )) : (t.tag = 0, t = Yo(
              null,
              t,
              e,
              l,
              n
            ));
          else {
            if (e != null) {
              var i = e.$$typeof;
              if (i === k) {
                t.tag = 11, t = Yd(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (i === X) {
                t.tag = 14, t = qd(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              }
            }
            throw t = pe(e) || e, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return Yo(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, i = wl(
          l,
          t.pendingProps
        ), Kd(
          e,
          t,
          l,
          i,
          n
        );
      case 3:
        e: {
          if (re(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(s(387));
          l = t.pendingProps;
          var u = t.memoizedState;
          i = u.element, fo(e, t), $a(t, l, null, n);
          var f = t.memoizedState;
          if (l = f.cache, jn(t, Je, l), l !== u.cache && io(
            t,
            [Je],
            n,
            !0
          ), Wa(), l = f.element, u.isDehydrated)
            if (u = {
              element: l,
              isDehydrated: !1,
              cache: f.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = kd(
                e,
                t,
                l,
                n
              );
              break e;
            } else if (l !== i) {
              i = Ht(
                Error(s(424)),
                t
              ), Xa(i), t = kd(
                e,
                t,
                l,
                n
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (Ye = Gt(e.firstChild), it = t, _e = !0, Dn = null, Yt = !0, n = Vf(
                t,
                null,
                l,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (pl(), l === i) {
              t = gn(
                e,
                t,
                n
              );
              break e;
            }
            ct(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return hu(e, t), e === null ? (n = oh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : _e || (n = t.type, e = t.pendingProps, l = Mu(
          F.current
        ).createElement(n), l[at] = t, l[dt] = e, ot(l, n, e), nt(l), t.stateNode = l) : t.memoizedState = oh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return xe(t), e === null && _e && (l = t.stateNode = ih(
          t.type,
          t.pendingProps,
          F.current
        ), it = t, Yt = !0, i = Ye, Jn(t.type) ? (wr = i, Ye = Gt(l.firstChild)) : Ye = i), ct(
          e,
          t,
          t.pendingProps.children,
          n
        ), hu(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && _e && ((i = l = Ye) && (l = Iy(
          l,
          t.type,
          t.pendingProps,
          Yt
        ), l !== null ? (t.stateNode = l, it = t, Ye = Gt(l.firstChild), Yt = !1, i = !0) : i = !1), i || Un(t)), xe(t), i = t.type, u = t.pendingProps, f = e !== null ? e.memoizedProps : null, l = u.children, Sr(i, u) ? l = null : f !== null && Sr(i, f) && (t.flags |= 32), t.memoizedState !== null && (i = bo(
          e,
          t,
          my,
          null,
          null,
          n
        ), gi._currentValue = i), hu(e, t), ct(e, t, l, n), t.child;
      case 6:
        return e === null && _e && ((e = n = Ye) && (n = Py(
          n,
          t.pendingProps,
          Yt
        ), n !== null ? (t.stateNode = n, it = t, Ye = null, e = !0) : e = !1), e || Un(t)), null;
      case 13:
        return Jd(e, t, n);
      case 4:
        return re(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = Al(
          t,
          null,
          l,
          n
        ) : ct(e, t, l, n), t.child;
      case 11:
        return Yd(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return ct(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return ct(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return ct(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return l = t.pendingProps, jn(t, t.type, l.value), ct(e, t, l.children, n), t.child;
      case 9:
        return i = t.type._context, l = t.pendingProps.children, bl(t), i = ut(i), l = l(i), t.flags |= 1, ct(e, t, l, n), t.child;
      case 14:
        return qd(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Gd(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return $d(e, t, n);
      case 31:
        return xy(e, t, n);
      case 22:
        return Vd(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return bl(t), l = ut(Je), e === null ? (i = oo(), i === null && (i = Le, u = uo(), i.pooledCache = u, u.refCount++, u !== null && (i.pooledCacheLanes |= n), i = u), t.memoizedState = { parent: l, cache: i }, so(t), jn(t, Je, i)) : ((e.lanes & n) !== 0 && (fo(e, t), $a(t, null, null, n), Wa()), i = e.memoizedState, u = t.memoizedState, i.parent !== l ? (i = { parent: l, cache: l }, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), jn(t, Je, l)) : (l = u.cache, jn(t, Je, l), l !== i.cache && io(
          t,
          [Je],
          n,
          !0
        ))), ct(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(s(156, t.tag));
  }
  function pn(e) {
    e.flags |= 4;
  }
  function ko(e, t, n, l, i) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (i & 335544128) === i)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Tm()) e.flags |= 8192;
        else
          throw El = Pi, ro;
    } else e.flags &= -16777217;
  }
  function Id(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !mh(t))
      if (Tm()) e.flags |= 8192;
      else
        throw El = Pi, ro;
  }
  function gu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? zs() : 536870912, e.lanes |= t, sa |= t);
  }
  function ni(e, t) {
    if (!_e)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            t.alternate !== null && (n = t), t = t.sibling;
          n === null ? e.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = e.tail;
          for (var l = null; n !== null; )
            n.alternate !== null && (l = n), n = n.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
      }
  }
  function qe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags & 65011712, l |= i.flags & 65011712, i.return = e, i = i.sibling;
    else
      for (i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags, l |= i.flags, i.return = e, i = i.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function Ay(e, t, n) {
    var l = t.pendingProps;
    switch (eo(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return qe(t), null;
      case 1:
        return qe(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), mn(Je), se(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Fl(t) ? pn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, no())), qe(t), null;
      case 26:
        var i = t.type, u = t.memoizedState;
        return e === null ? (pn(t), u !== null ? (qe(t), Id(t, u)) : (qe(t), ko(
          t,
          i,
          null,
          l,
          n
        ))) : u ? u !== e.memoizedState ? (pn(t), qe(t), Id(t, u)) : (qe(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && pn(t), qe(t), ko(
          t,
          i,
          e,
          l,
          n
        )), null;
      case 27:
        if (Ae(t), n = F.current, i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && pn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(s(166));
            return qe(t), null;
          }
          e = P.current, Fl(t) ? Mf(t) : (e = ih(i, l, n), t.stateNode = e, pn(t));
        }
        return qe(t), null;
      case 5:
        if (Ae(t), i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && pn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(s(166));
            return qe(t), null;
          }
          if (u = P.current, Fl(t))
            Mf(t);
          else {
            var f = Mu(
              F.current
            );
            switch (u) {
              case 1:
                u = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  i
                );
                break;
              case 2:
                u = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  i
                );
                break;
              default:
                switch (i) {
                  case "svg":
                    u = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      i
                    );
                    break;
                  case "math":
                    u = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      i
                    );
                    break;
                  case "script":
                    u = f.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof l.is == "string" ? f.createElement("select", {
                      is: l.is
                    }) : f.createElement("select"), l.multiple ? u.multiple = !0 : l.size && (u.size = l.size);
                    break;
                  default:
                    u = typeof l.is == "string" ? f.createElement(i, { is: l.is }) : f.createElement(i);
                }
            }
            u[at] = t, u[dt] = l;
            e: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                u.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === t) break e;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t)
                  break e;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            t.stateNode = u;
            e: switch (ot(u, i, l), i) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && pn(t);
          }
        }
        return qe(t), ko(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && pn(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(s(166));
          if (e = F.current, Fl(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, i = it, i !== null)
              switch (i.tag) {
                case 27:
                case 5:
                  l = i.memoizedProps;
              }
            e[at] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Jm(e.nodeValue, n)), e || Un(t, !0);
          } else
            e = Mu(e).createTextNode(
              l
            ), e[at] = t, t.stateNode = e;
        }
        return qe(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = Fl(t), n !== null) {
            if (e === null) {
              if (!l) throw Error(s(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(557));
              e[at] = t;
            } else
              pl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            qe(t), e = !1;
          } else
            n = no(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Ot(t), t) : (Ot(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(s(558));
        }
        return qe(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (i = Fl(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(s(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(s(317));
              i[at] = t;
            } else
              pl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            qe(t), i = !1;
          } else
            i = no(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
          if (!i)
            return t.flags & 256 ? (Ot(t), t) : (Ot(t), null);
        }
        return Ot(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = l !== null, e = e !== null && e.memoizedState !== null, n && (l = t.child, i = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (i = l.alternate.memoizedState.cachePool.pool), u = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), u !== i && (l.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), gu(t, t.updateQueue), qe(t), null);
      case 4:
        return se(), e === null && vr(t.stateNode.containerInfo), qe(t), null;
      case 10:
        return mn(t.type), qe(t), null;
      case 19:
        if (Q(Ze), l = t.memoizedState, l === null) return qe(t), null;
        if (i = (t.flags & 128) !== 0, u = l.rendering, u === null)
          if (i) ni(l, !1);
          else {
            if (Xe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = lu(e), u !== null) {
                  for (t.flags |= 128, ni(l, !1), e = u.updateQueue, t.updateQueue = e, gu(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    Cf(n, e), n = n.sibling;
                  return $(
                    Ze,
                    Ze.current & 1 | 2
                  ), _e && fn(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && xt() > xu && (t.flags |= 128, i = !0, ni(l, !1), t.lanes = 4194304);
          }
        else {
          if (!i)
            if (e = lu(u), e !== null) {
              if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, gu(t, e), ni(l, !0), l.tail === null && l.tailMode === "hidden" && !u.alternate && !_e)
                return qe(t), null;
            } else
              2 * xt() - l.renderingStartTime > xu && n !== 536870912 && (t.flags |= 128, i = !0, ni(l, !1), t.lanes = 4194304);
          l.isBackwards ? (u.sibling = t.child, t.child = u) : (e = l.last, e !== null ? e.sibling = u : t.child = u, l.last = u);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = xt(), e.sibling = null, n = Ze.current, $(
          Ze,
          i ? n & 1 | 2 : n & 1
        ), _e && fn(t, l.treeForkCount), e) : (qe(t), null);
      case 22:
      case 23:
        return Ot(t), go(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (qe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : qe(t), n = t.updateQueue, n !== null && gu(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && Q(Sl), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), mn(Je), qe(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Ty(e, t) {
    switch (eo(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return mn(Je), se(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ae(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Ot(t), t.alternate === null)
            throw Error(s(340));
          pl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Ot(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          pl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Q(Ze), null;
      case 4:
        return se(), null;
      case 10:
        return mn(t.type), null;
      case 22:
      case 23:
        return Ot(t), go(), e !== null && Q(Sl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return mn(Je), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Pd(e, t) {
    switch (eo(t), t.tag) {
      case 3:
        mn(Je), se();
        break;
      case 26:
      case 27:
      case 5:
        Ae(t);
        break;
      case 4:
        se();
        break;
      case 31:
        t.memoizedState !== null && Ot(t);
        break;
      case 13:
        Ot(t);
        break;
      case 19:
        Q(Ze);
        break;
      case 10:
        mn(t.type);
        break;
      case 22:
      case 23:
        Ot(t), go(), e !== null && Q(Sl);
        break;
      case 24:
        mn(Je);
    }
  }
  function li(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var i = l.next;
        n = i;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var u = n.create, f = n.inst;
            l = u(), f.destroy = l;
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (g) {
      De(t, t.return, g);
    }
  }
  function Gn(e, t, n) {
    try {
      var l = t.updateQueue, i = l !== null ? l.lastEffect : null;
      if (i !== null) {
        var u = i.next;
        l = u;
        do {
          if ((l.tag & e) === e) {
            var f = l.inst, g = f.destroy;
            if (g !== void 0) {
              f.destroy = void 0, i = t;
              var x = n, M = g;
              try {
                M();
              } catch (q) {
                De(
                  i,
                  x,
                  q
                );
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (q) {
      De(t, t.return, q);
    }
  }
  function em(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Qf(t, n);
      } catch (l) {
        De(e, e.return, l);
      }
    }
  }
  function tm(e, t, n) {
    n.props = wl(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      De(e, t, l);
    }
  }
  function ai(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof n == "function" ? e.refCleanup = n(l) : n.current = l;
      }
    } catch (i) {
      De(e, t, i);
    }
  }
  function Ft(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (i) {
          De(e, t, i);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          De(e, t, i);
        }
      else n.current = null;
  }
  function nm(e) {
    var t = e.type, n = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break e;
        case "img":
          n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (i) {
      De(e, e.return, i);
    }
  }
  function Jo(e, t, n) {
    try {
      var l = e.stateNode;
      Ky(l, e.type, n, t), l[dt] = t;
    } catch (i) {
      De(e, e.return, i);
    }
  }
  function lm(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Jn(e.type) || e.tag === 4;
  }
  function Wo(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || lm(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Jn(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function $o(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = on));
    else if (l !== 4 && (l === 27 && Jn(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for ($o(e, t, n), e = e.sibling; e !== null; )
        $o(e, t, n), e = e.sibling;
  }
  function pu(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (l !== 4 && (l === 27 && Jn(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (pu(e, t, n), e = e.sibling; e !== null; )
        pu(e, t, n), e = e.sibling;
  }
  function am(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var l = e.type, i = t.attributes; i.length; )
        t.removeAttributeNode(i[0]);
      ot(t, l, n), t[at] = e, t[dt] = n;
    } catch (u) {
      De(e, e.return, u);
    }
  }
  var yn = !1, Fe = !1, Fo = !1, im = typeof WeakSet == "function" ? WeakSet : Set, lt = null;
  function wy(e, t) {
    if (e = e.containerInfo, yr = Bu, e = pf(e), Xc(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var l = n.getSelection && n.getSelection();
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode;
            var i = l.anchorOffset, u = l.focusNode;
            l = l.focusOffset;
            try {
              n.nodeType, u.nodeType;
            } catch {
              n = null;
              break e;
            }
            var f = 0, g = -1, x = -1, M = 0, q = 0, K = e, N = null;
            t: for (; ; ) {
              for (var H; K !== n || i !== 0 && K.nodeType !== 3 || (g = f + i), K !== u || l !== 0 && K.nodeType !== 3 || (x = f + l), K.nodeType === 3 && (f += K.nodeValue.length), (H = K.firstChild) !== null; )
                N = K, K = H;
              for (; ; ) {
                if (K === e) break t;
                if (N === n && ++M === i && (g = f), N === u && ++q === l && (x = f), (H = K.nextSibling) !== null) break;
                K = N, N = K.parentNode;
              }
              K = H;
            }
            n = g === -1 || x === -1 ? null : { start: g, end: x };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (br = { focusedElem: e, selectionRange: n }, Bu = !1, lt = t; lt !== null; )
      if (t = lt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, lt = e;
      else
        for (; lt !== null; ) {
          switch (t = lt, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (n = 0; n < e.length; n++)
                  i = e[n], i.ref.impl = i.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, n = t, i = u.memoizedProps, u = u.memoizedState, l = n.stateNode;
                try {
                  var ee = wl(
                    n.type,
                    i
                  );
                  e = l.getSnapshotBeforeUpdate(
                    ee,
                    u
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (fe) {
                  De(
                    n,
                    n.return,
                    fe
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  Er(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Er(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(s(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, lt = e;
            break;
          }
          lt = t.return;
        }
  }
  function um(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Sn(e, n), l & 4 && li(5, n);
        break;
      case 1:
        if (Sn(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (f) {
              De(n, n.return, f);
            }
          else {
            var i = wl(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                i,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              De(
                n,
                n.return,
                f
              );
            }
          }
        l & 64 && em(n), l & 512 && ai(n, n.return);
        break;
      case 3:
        if (Sn(e, n), l & 64 && (e = n.updateQueue, e !== null)) {
          if (t = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            Qf(e, t);
          } catch (f) {
            De(n, n.return, f);
          }
        }
        break;
      case 27:
        t === null && l & 4 && am(n);
      case 26:
      case 5:
        Sn(e, n), t === null && l & 4 && nm(n), l & 512 && ai(n, n.return);
        break;
      case 12:
        Sn(e, n);
        break;
      case 31:
        Sn(e, n), l & 4 && rm(e, n);
        break;
      case 13:
        Sn(e, n), l & 4 && sm(e, n), l & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Uy.bind(
          null,
          n
        ), eb(e, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || yn, !l) {
          t = t !== null && t.memoizedState !== null || Fe, i = yn;
          var u = Fe;
          yn = l, (Fe = t) && !u ? xn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : Sn(e, n), yn = i, Fe = u;
        }
        break;
      case 30:
        break;
      default:
        Sn(e, n);
    }
  }
  function cm(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, cm(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Cc(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ge = null, ht = !1;
  function bn(e, t, n) {
    for (n = n.child; n !== null; )
      om(e, t, n), n = n.sibling;
  }
  function om(e, t, n) {
    if (Et && typeof Et.onCommitFiberUnmount == "function")
      try {
        Et.onCommitFiberUnmount(_a, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Fe || Ft(n, t), bn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Fe || Ft(n, t);
        var l = Ge, i = ht;
        Jn(n.type) && (Ge = n.stateNode, ht = !1), bn(
          e,
          t,
          n
        ), mi(n.stateNode), Ge = l, ht = i;
        break;
      case 5:
        Fe || Ft(n, t);
      case 6:
        if (l = Ge, i = ht, Ge = null, bn(
          e,
          t,
          n
        ), Ge = l, ht = i, Ge !== null)
          if (ht)
            try {
              (Ge.nodeType === 9 ? Ge.body : Ge.nodeName === "HTML" ? Ge.ownerDocument.body : Ge).removeChild(n.stateNode);
            } catch (u) {
              De(
                n,
                t,
                u
              );
            }
          else
            try {
              Ge.removeChild(n.stateNode);
            } catch (u) {
              De(
                n,
                t,
                u
              );
            }
        break;
      case 18:
        Ge !== null && (ht ? (e = Ge, eh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), ya(e)) : eh(Ge, n.stateNode));
        break;
      case 4:
        l = Ge, i = ht, Ge = n.stateNode.containerInfo, ht = !0, bn(
          e,
          t,
          n
        ), Ge = l, ht = i;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Gn(2, n, t), Fe || Gn(4, n, t), bn(
          e,
          t,
          n
        );
        break;
      case 1:
        Fe || (Ft(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && tm(
          n,
          t,
          l
        )), bn(
          e,
          t,
          n
        );
        break;
      case 21:
        bn(
          e,
          t,
          n
        );
        break;
      case 22:
        Fe = (l = Fe) || n.memoizedState !== null, bn(
          e,
          t,
          n
        ), Fe = l;
        break;
      default:
        bn(
          e,
          t,
          n
        );
    }
  }
  function rm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        ya(e);
      } catch (n) {
        De(t, t.return, n);
      }
    }
  }
  function sm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        ya(e);
      } catch (n) {
        De(t, t.return, n);
      }
  }
  function Cy(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new im()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new im()), t;
      default:
        throw Error(s(435, e.tag));
    }
  }
  function yu(e, t) {
    var n = Cy(e);
    t.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var i = jy.bind(null, e, l);
        l.then(i, i);
      }
    });
  }
  function vt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var i = n[l], u = e, f = t, g = f;
        e: for (; g !== null; ) {
          switch (g.tag) {
            case 27:
              if (Jn(g.type)) {
                Ge = g.stateNode, ht = !1;
                break e;
              }
              break;
            case 5:
              Ge = g.stateNode, ht = !1;
              break e;
            case 3:
            case 4:
              Ge = g.stateNode.containerInfo, ht = !0;
              break e;
          }
          g = g.return;
        }
        if (Ge === null) throw Error(s(160));
        om(u, f, i), Ge = null, ht = !1, u = i.alternate, u !== null && (u.return = null), i.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        fm(t, e), t = t.sibling;
  }
  var Qt = null;
  function fm(e, t) {
    var n = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        vt(t, e), gt(e), l & 4 && (Gn(3, e, e.return), li(3, e), Gn(5, e, e.return));
        break;
      case 1:
        vt(t, e), gt(e), l & 512 && (Fe || n === null || Ft(n, n.return)), l & 64 && yn && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
        break;
      case 26:
        var i = Qt;
        if (vt(t, e), gt(e), l & 512 && (Fe || n === null || Ft(n, n.return)), l & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (l = e.memoizedState, n === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
                  t: switch (l) {
                    case "title":
                      u = i.getElementsByTagName("title")[0], (!u || u[Ma] || u[at] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = i.createElement(l), i.head.insertBefore(
                        u,
                        i.querySelector("head > title")
                      )), ot(u, l, n), u[at] = e, nt(u), l = u;
                      break e;
                    case "link":
                      var f = fh(
                        "link",
                        "href",
                        i
                      ).get(l + (n.href || ""));
                      if (f) {
                        for (var g = 0; g < f.length; g++)
                          if (u = f[g], u.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            f.splice(g, 1);
                            break t;
                          }
                      }
                      u = i.createElement(l), ot(u, l, n), i.head.appendChild(u);
                      break;
                    case "meta":
                      if (f = fh(
                        "meta",
                        "content",
                        i
                      ).get(l + (n.content || ""))) {
                        for (g = 0; g < f.length; g++)
                          if (u = f[g], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            f.splice(g, 1);
                            break t;
                          }
                      }
                      u = i.createElement(l), ot(u, l, n), i.head.appendChild(u);
                      break;
                    default:
                      throw Error(s(468, l));
                  }
                  u[at] = e, nt(u), l = u;
                }
                e.stateNode = l;
              } else
                dh(
                  i,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = sh(
                i,
                l,
                e.memoizedProps
              );
          else
            u !== l ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, l === null ? dh(
              i,
              e.type,
              e.stateNode
            ) : sh(
              i,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Jo(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        vt(t, e), gt(e), l & 512 && (Fe || n === null || Ft(n, n.return)), n !== null && l & 4 && Jo(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (vt(t, e), gt(e), l & 512 && (Fe || n === null || Ft(n, n.return)), e.flags & 32) {
          i = e.stateNode;
          try {
            Gl(i, "");
          } catch (ee) {
            De(e, e.return, ee);
          }
        }
        l & 4 && e.stateNode != null && (i = e.memoizedProps, Jo(
          e,
          i,
          n !== null ? n.memoizedProps : i
        )), l & 1024 && (Fo = !0);
        break;
      case 6:
        if (vt(t, e), gt(e), l & 4) {
          if (e.stateNode === null)
            throw Error(s(162));
          l = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = l;
          } catch (ee) {
            De(e, e.return, ee);
          }
        }
        break;
      case 3:
        if (Uu = null, i = Qt, Qt = Nu(t.containerInfo), vt(t, e), Qt = i, gt(e), l & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            ya(t.containerInfo);
          } catch (ee) {
            De(e, e.return, ee);
          }
        Fo && (Fo = !1, dm(e));
        break;
      case 4:
        l = Qt, Qt = Nu(
          e.stateNode.containerInfo
        ), vt(t, e), gt(e), Qt = l;
        break;
      case 12:
        vt(t, e), gt(e);
        break;
      case 31:
        vt(t, e), gt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, yu(e, l)));
        break;
      case 13:
        vt(t, e), gt(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Su = xt()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, yu(e, l)));
        break;
      case 22:
        i = e.memoizedState !== null;
        var x = n !== null && n.memoizedState !== null, M = yn, q = Fe;
        if (yn = M || i, Fe = q || x, vt(t, e), Fe = q, yn = M, gt(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || x || yn || Fe || Cl(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                x = n = t;
                try {
                  if (u = x.stateNode, i)
                    f = u.style, typeof f.setProperty == "function" ? f.setProperty("display", "none", "important") : f.display = "none";
                  else {
                    g = x.stateNode;
                    var K = x.memoizedProps.style, N = K != null && K.hasOwnProperty("display") ? K.display : null;
                    g.style.display = N == null || typeof N == "boolean" ? "" : ("" + N).trim();
                  }
                } catch (ee) {
                  De(x, x.return, ee);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                x = t;
                try {
                  x.stateNode.nodeValue = i ? "" : x.memoizedProps;
                } catch (ee) {
                  De(x, x.return, ee);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                x = t;
                try {
                  var H = x.stateNode;
                  i ? th(H, !0) : th(x.stateNode, !1);
                } catch (ee) {
                  De(x, x.return, ee);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              n === t && (n = null), t = t.return;
            }
            n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
          }
        l & 4 && (l = e.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, yu(e, n))));
        break;
      case 19:
        vt(t, e), gt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, yu(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        vt(t, e), gt(e);
    }
  }
  function gt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (lm(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(s(160));
        switch (n.tag) {
          case 27:
            var i = n.stateNode, u = Wo(e);
            pu(e, u, i);
            break;
          case 5:
            var f = n.stateNode;
            n.flags & 32 && (Gl(f, ""), n.flags &= -33);
            var g = Wo(e);
            pu(e, g, f);
            break;
          case 3:
          case 4:
            var x = n.stateNode.containerInfo, M = Wo(e);
            $o(
              e,
              M,
              x
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (q) {
        De(e, e.return, q);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function dm(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        dm(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Sn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        um(e, t.alternate, t), t = t.sibling;
  }
  function Cl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Gn(4, t, t.return), Cl(t);
          break;
        case 1:
          Ft(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && tm(
            t,
            t.return,
            n
          ), Cl(t);
          break;
        case 27:
          mi(t.stateNode);
        case 26:
        case 5:
          Ft(t, t.return), Cl(t);
          break;
        case 22:
          t.memoizedState === null && Cl(t);
          break;
        case 30:
          Cl(t);
          break;
        default:
          Cl(t);
      }
      e = e.sibling;
    }
  }
  function xn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, i = e, u = t, f = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          xn(
            i,
            u,
            n
          ), li(4, u);
          break;
        case 1:
          if (xn(
            i,
            u,
            n
          ), l = u, i = l.stateNode, typeof i.componentDidMount == "function")
            try {
              i.componentDidMount();
            } catch (M) {
              De(l, l.return, M);
            }
          if (l = u, i = l.updateQueue, i !== null) {
            var g = l.stateNode;
            try {
              var x = i.shared.hiddenCallbacks;
              if (x !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < x.length; i++)
                  Xf(x[i], g);
            } catch (M) {
              De(l, l.return, M);
            }
          }
          n && f & 64 && em(u), ai(u, u.return);
          break;
        case 27:
          am(u);
        case 26:
        case 5:
          xn(
            i,
            u,
            n
          ), n && l === null && f & 4 && nm(u), ai(u, u.return);
          break;
        case 12:
          xn(
            i,
            u,
            n
          );
          break;
        case 31:
          xn(
            i,
            u,
            n
          ), n && f & 4 && rm(i, u);
          break;
        case 13:
          xn(
            i,
            u,
            n
          ), n && f & 4 && sm(i, u);
          break;
        case 22:
          u.memoizedState === null && xn(
            i,
            u,
            n
          ), ai(u, u.return);
          break;
        case 30:
          break;
        default:
          xn(
            i,
            u,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Io(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Qa(n));
  }
  function Po(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Qa(e));
  }
  function Zt(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        mm(
          e,
          t,
          n,
          l
        ), t = t.sibling;
  }
  function mm(e, t, n, l) {
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Zt(
          e,
          t,
          n,
          l
        ), i & 2048 && li(9, t);
        break;
      case 1:
        Zt(
          e,
          t,
          n,
          l
        );
        break;
      case 3:
        Zt(
          e,
          t,
          n,
          l
        ), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Qa(e)));
        break;
      case 12:
        if (i & 2048) {
          Zt(
            e,
            t,
            n,
            l
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, f = u.id, g = u.onPostCommit;
            typeof g == "function" && g(
              f,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (x) {
            De(t, t.return, x);
          }
        } else
          Zt(
            e,
            t,
            n,
            l
          );
        break;
      case 31:
        Zt(
          e,
          t,
          n,
          l
        );
        break;
      case 13:
        Zt(
          e,
          t,
          n,
          l
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, f = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? Zt(
          e,
          t,
          n,
          l
        ) : ii(e, t) : u._visibility & 2 ? Zt(
          e,
          t,
          n,
          l
        ) : (u._visibility |= 2, ca(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), i & 2048 && Io(f, t);
        break;
      case 24:
        Zt(
          e,
          t,
          n,
          l
        ), i & 2048 && Po(t.alternate, t);
        break;
      default:
        Zt(
          e,
          t,
          n,
          l
        );
    }
  }
  function ca(e, t, n, l, i) {
    for (i = i && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, f = t, g = n, x = l, M = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          ca(
            u,
            f,
            g,
            x,
            i
          ), li(8, f);
          break;
        case 23:
          break;
        case 22:
          var q = f.stateNode;
          f.memoizedState !== null ? q._visibility & 2 ? ca(
            u,
            f,
            g,
            x,
            i
          ) : ii(
            u,
            f
          ) : (q._visibility |= 2, ca(
            u,
            f,
            g,
            x,
            i
          )), i && M & 2048 && Io(
            f.alternate,
            f
          );
          break;
        case 24:
          ca(
            u,
            f,
            g,
            x,
            i
          ), i && M & 2048 && Po(f.alternate, f);
          break;
        default:
          ca(
            u,
            f,
            g,
            x,
            i
          );
      }
      t = t.sibling;
    }
  }
  function ii(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, i = l.flags;
        switch (l.tag) {
          case 22:
            ii(n, l), i & 2048 && Io(
              l.alternate,
              l
            );
            break;
          case 24:
            ii(n, l), i & 2048 && Po(l.alternate, l);
            break;
          default:
            ii(n, l);
        }
        t = t.sibling;
      }
  }
  var ui = 8192;
  function oa(e, t, n) {
    if (e.subtreeFlags & ui)
      for (e = e.child; e !== null; )
        hm(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function hm(e, t, n) {
    switch (e.tag) {
      case 26:
        oa(
          e,
          t,
          n
        ), e.flags & ui && e.memoizedState !== null && db(
          n,
          Qt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        oa(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var l = Qt;
        Qt = Nu(e.stateNode.containerInfo), oa(
          e,
          t,
          n
        ), Qt = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = ui, ui = 16777216, oa(
          e,
          t,
          n
        ), ui = l) : oa(
          e,
          t,
          n
        ));
        break;
      default:
        oa(
          e,
          t,
          n
        );
    }
  }
  function vm(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ci(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          lt = l, pm(
            l,
            e
          );
        }
      vm(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        gm(e), e = e.sibling;
  }
  function gm(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ci(e), e.flags & 2048 && Gn(9, e, e.return);
        break;
      case 3:
        ci(e);
        break;
      case 12:
        ci(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, bu(e)) : ci(e);
        break;
      default:
        ci(e);
    }
  }
  function bu(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          lt = l, pm(
            l,
            e
          );
        }
      vm(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Gn(8, t, t.return), bu(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, bu(t));
          break;
        default:
          bu(t);
      }
      e = e.sibling;
    }
  }
  function pm(e, t) {
    for (; lt !== null; ) {
      var n = lt;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Gn(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Qa(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, lt = l;
      else
        e: for (n = e; lt !== null; ) {
          l = lt;
          var i = l.sibling, u = l.return;
          if (cm(l), l === n) {
            lt = null;
            break e;
          }
          if (i !== null) {
            i.return = u, lt = i;
            break e;
          }
          lt = u;
        }
    }
  }
  var Oy = {
    getCacheForType: function(e) {
      var t = ut(Je), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return ut(Je).controller.signal;
    }
  }, _y = typeof WeakMap == "function" ? WeakMap : Map, Me = 0, Le = null, Te = null, Ce = 0, Ne = 0, _t = null, Vn = !1, ra = !1, er = !1, En = 0, Xe = 0, Xn = 0, Ol = 0, tr = 0, Rt = 0, sa = 0, oi = null, pt = null, nr = !1, Su = 0, ym = 0, xu = 1 / 0, Eu = null, Qn = null, Pe = 0, Zn = null, fa = null, An = 0, lr = 0, ar = null, bm = null, ri = 0, ir = null;
  function zt() {
    return (Me & 2) !== 0 && Ce !== 0 ? Ce & -Ce : B.T !== null ? fr() : Us();
  }
  function Sm() {
    if (Rt === 0)
      if ((Ce & 536870912) === 0 || _e) {
        var e = zi;
        zi <<= 1, (zi & 3932160) === 0 && (zi = 262144), Rt = e;
      } else Rt = 536870912;
    return e = Ct.current, e !== null && (e.flags |= 32), Rt;
  }
  function yt(e, t, n) {
    (e === Le && (Ne === 2 || Ne === 9) || e.cancelPendingCommit !== null) && (da(e, 0), Kn(
      e,
      Ce,
      Rt,
      !1
    )), za(e, n), ((Me & 2) === 0 || e !== Le) && (e === Le && ((Me & 2) === 0 && (Ol |= n), Xe === 4 && Kn(
      e,
      Ce,
      Rt,
      !1
    )), It(e));
  }
  function xm(e, t, n) {
    if ((Me & 6) !== 0) throw Error(s(327));
    var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Ra(e, t), i = l ? My(e, t) : cr(e, t, !0), u = l;
    do {
      if (i === 0) {
        ra && !l && Kn(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, u && !Ry(n)) {
          i = cr(e, t, !1), u = !1;
          continue;
        }
        if (i === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var f = 0;
          else
            f = e.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            t = f;
            e: {
              var g = e;
              i = oi;
              var x = g.current.memoizedState.isDehydrated;
              if (x && (da(g, f).flags |= 256), f = cr(
                g,
                f,
                !1
              ), f !== 2) {
                if (er && !x) {
                  g.errorRecoveryDisabledLanes |= u, Ol |= u, i = 4;
                  break e;
                }
                u = pt, pt = i, u !== null && (pt === null ? pt = u : pt.push.apply(
                  pt,
                  u
                ));
              }
              i = f;
            }
            if (u = !1, i !== 2) continue;
          }
        }
        if (i === 1) {
          da(e, 0), Kn(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, u = i, u) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Kn(
                l,
                t,
                Rt,
                !Vn
              );
              break e;
            case 2:
              pt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((t & 62914560) === t && (i = Su + 300 - xt(), 10 < i)) {
            if (Kn(
              l,
              t,
              Rt,
              !Vn
            ), Ni(l, 0, !0) !== 0) break e;
            An = t, l.timeoutHandle = Im(
              Em.bind(
                null,
                l,
                n,
                pt,
                Eu,
                nr,
                t,
                Rt,
                Ol,
                sa,
                Vn,
                u,
                "Throttled",
                -0,
                0
              ),
              i
            );
            break e;
          }
          Em(
            l,
            n,
            pt,
            Eu,
            nr,
            t,
            Rt,
            Ol,
            sa,
            Vn,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    It(e);
  }
  function Em(e, t, n, l, i, u, f, g, x, M, q, K, N, H) {
    if (e.timeoutHandle = -1, K = t.subtreeFlags, K & 8192 || (K & 16785408) === 16785408) {
      K = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: on
      }, hm(
        t,
        u,
        K
      );
      var ee = (u & 62914560) === u ? Su - xt() : (u & 4194048) === u ? ym - xt() : 0;
      if (ee = mb(
        K,
        ee
      ), ee !== null) {
        An = u, e.cancelPendingCommit = ee(
          zm.bind(
            null,
            e,
            t,
            u,
            n,
            l,
            i,
            f,
            g,
            x,
            q,
            K,
            null,
            N,
            H
          )
        ), Kn(e, u, f, !M);
        return;
      }
    }
    zm(
      e,
      t,
      u,
      n,
      l,
      i,
      f,
      g,
      x
    );
  }
  function Ry(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var i = n[l], u = i.getSnapshot;
          i = i.value;
          try {
            if (!Tt(u(), i)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null)
        n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Kn(e, t, n, l) {
    t &= ~tr, t &= ~Ol, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var i = t; 0 < i; ) {
      var u = 31 - At(i), f = 1 << u;
      l[u] = -1, i &= ~f;
    }
    n !== 0 && Ms(e, n, t);
  }
  function Au() {
    return (Me & 6) === 0 ? (si(0), !1) : !0;
  }
  function ur() {
    if (Te !== null) {
      if (Ne === 0)
        var e = Te.return;
      else
        e = Te, dn = yl = null, Eo(e), na = null, Ka = 0, e = Te;
      for (; e !== null; )
        Pd(e.alternate, e), e = e.return;
      Te = null;
    }
  }
  function da(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, Wy(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), An = 0, ur(), Le = e, Te = n = sn(e.current, null), Ce = t, Ne = 0, _t = null, Vn = !1, ra = Ra(e, t), er = !1, sa = Rt = tr = Ol = Xn = Xe = 0, pt = oi = null, nr = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var i = 31 - At(l), u = 1 << i;
        t |= e[i], l &= ~u;
      }
    return En = t, Qi(), n;
  }
  function Am(e, t) {
    ye = null, B.H = ei, t === ta || t === Ii ? (t = Yf(), Ne = 3) : t === ro ? (t = Yf(), Ne = 4) : Ne = t === Bo ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, _t = t, Te === null && (Xe = 1, du(
      e,
      Ht(t, e.current)
    ));
  }
  function Tm() {
    var e = Ct.current;
    return e === null ? !0 : (Ce & 4194048) === Ce ? qt === null : (Ce & 62914560) === Ce || (Ce & 536870912) !== 0 ? e === qt : !1;
  }
  function wm() {
    var e = B.H;
    return B.H = ei, e === null ? ei : e;
  }
  function Cm() {
    var e = B.A;
    return B.A = Oy, e;
  }
  function Tu() {
    Xe = 4, Vn || (Ce & 4194048) !== Ce && Ct.current !== null || (ra = !0), (Xn & 134217727) === 0 && (Ol & 134217727) === 0 || Le === null || Kn(
      Le,
      Ce,
      Rt,
      !1
    );
  }
  function cr(e, t, n) {
    var l = Me;
    Me |= 2;
    var i = wm(), u = Cm();
    (Le !== e || Ce !== t) && (Eu = null, da(e, t)), t = !1;
    var f = Xe;
    e: do
      try {
        if (Ne !== 0 && Te !== null) {
          var g = Te, x = _t;
          switch (Ne) {
            case 8:
              ur(), f = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Ct.current === null && (t = !0);
              var M = Ne;
              if (Ne = 0, _t = null, ma(e, g, x, M), n && ra) {
                f = 0;
                break e;
              }
              break;
            default:
              M = Ne, Ne = 0, _t = null, ma(e, g, x, M);
          }
        }
        zy(), f = Xe;
        break;
      } catch (q) {
        Am(e, q);
      }
    while (!0);
    return t && e.shellSuspendCounter++, dn = yl = null, Me = l, B.H = i, B.A = u, Te === null && (Le = null, Ce = 0, Qi()), f;
  }
  function zy() {
    for (; Te !== null; ) Om(Te);
  }
  function My(e, t) {
    var n = Me;
    Me |= 2;
    var l = wm(), i = Cm();
    Le !== e || Ce !== t ? (Eu = null, xu = xt() + 500, da(e, t)) : ra = Ra(
      e,
      t
    );
    e: do
      try {
        if (Ne !== 0 && Te !== null) {
          t = Te;
          var u = _t;
          t: switch (Ne) {
            case 1:
              Ne = 0, _t = null, ma(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (Lf(u)) {
                Ne = 0, _t = null, _m(t);
                break;
              }
              t = function() {
                Ne !== 2 && Ne !== 9 || Le !== e || (Ne = 7), It(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ne = 7;
              break e;
            case 4:
              Ne = 5;
              break e;
            case 7:
              Lf(u) ? (Ne = 0, _t = null, _m(t)) : (Ne = 0, _t = null, ma(e, t, u, 7));
              break;
            case 5:
              var f = null;
              switch (Te.tag) {
                case 26:
                  f = Te.memoizedState;
                case 5:
                case 27:
                  var g = Te;
                  if (f ? mh(f) : g.stateNode.complete) {
                    Ne = 0, _t = null;
                    var x = g.sibling;
                    if (x !== null) Te = x;
                    else {
                      var M = g.return;
                      M !== null ? (Te = M, wu(M)) : Te = null;
                    }
                    break t;
                  }
              }
              Ne = 0, _t = null, ma(e, t, u, 5);
              break;
            case 6:
              Ne = 0, _t = null, ma(e, t, u, 6);
              break;
            case 8:
              ur(), Xe = 6;
              break e;
            default:
              throw Error(s(462));
          }
        }
        Ny();
        break;
      } catch (q) {
        Am(e, q);
      }
    while (!0);
    return dn = yl = null, B.H = l, B.A = i, Me = n, Te !== null ? 0 : (Le = null, Ce = 0, Qi(), Xe);
  }
  function Ny() {
    for (; Te !== null && !tp(); )
      Om(Te);
  }
  function Om(e) {
    var t = Fd(e.alternate, e, En);
    e.memoizedProps = e.pendingProps, t === null ? wu(e) : Te = t;
  }
  function _m(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Zd(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Ce
        );
        break;
      case 11:
        t = Zd(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Ce
        );
        break;
      case 5:
        Eo(t);
      default:
        Pd(n, t), t = Te = Cf(t, En), t = Fd(n, t, En);
    }
    e.memoizedProps = e.pendingProps, t === null ? wu(e) : Te = t;
  }
  function ma(e, t, n, l) {
    dn = yl = null, Eo(t), na = null, Ka = 0;
    var i = t.return;
    try {
      if (Sy(
        e,
        i,
        t,
        n,
        Ce
      )) {
        Xe = 1, du(
          e,
          Ht(n, e.current)
        ), Te = null;
        return;
      }
    } catch (u) {
      if (i !== null) throw Te = i, u;
      Xe = 1, du(
        e,
        Ht(n, e.current)
      ), Te = null;
      return;
    }
    t.flags & 32768 ? (_e || l === 1 ? e = !0 : ra || (Ce & 536870912) !== 0 ? e = !1 : (Vn = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Ct.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Rm(t, e)) : wu(t);
  }
  function wu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Rm(
          t,
          Vn
        );
        return;
      }
      e = t.return;
      var n = Ay(
        t.alternate,
        t,
        En
      );
      if (n !== null) {
        Te = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        Te = t;
        return;
      }
      Te = t = e;
    } while (t !== null);
    Xe === 0 && (Xe = 5);
  }
  function Rm(e, t) {
    do {
      var n = Ty(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, Te = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        Te = e;
        return;
      }
      Te = e = n;
    } while (e !== null);
    Xe = 6, Te = null;
  }
  function zm(e, t, n, l, i, u, f, g, x) {
    e.cancelPendingCommit = null;
    do
      Cu();
    while (Pe !== 0);
    if ((Me & 6) !== 0) throw Error(s(327));
    if (t !== null) {
      if (t === e.current) throw Error(s(177));
      if (u = t.lanes | t.childLanes, u |= Jc, fp(
        e,
        n,
        u,
        f,
        g,
        x
      ), e === Le && (Te = Le = null, Ce = 0), fa = t, Zn = e, An = n, lr = u, ar = i, bm = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Hy(_i, function() {
        return jm(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = B.T, B.T = null, i = G.p, G.p = 2, f = Me, Me |= 4;
        try {
          wy(e, t, n);
        } finally {
          Me = f, G.p = i, B.T = l;
        }
      }
      Pe = 1, Mm(), Nm(), Dm();
    }
  }
  function Mm() {
    if (Pe === 1) {
      Pe = 0;
      var e = Zn, t = fa, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = B.T, B.T = null;
        var l = G.p;
        G.p = 2;
        var i = Me;
        Me |= 4;
        try {
          fm(t, e);
          var u = br, f = pf(e.containerInfo), g = u.focusedElem, x = u.selectionRange;
          if (f !== g && g && g.ownerDocument && gf(
            g.ownerDocument.documentElement,
            g
          )) {
            if (x !== null && Xc(g)) {
              var M = x.start, q = x.end;
              if (q === void 0 && (q = M), "selectionStart" in g)
                g.selectionStart = M, g.selectionEnd = Math.min(
                  q,
                  g.value.length
                );
              else {
                var K = g.ownerDocument || document, N = K && K.defaultView || window;
                if (N.getSelection) {
                  var H = N.getSelection(), ee = g.textContent.length, fe = Math.min(x.start, ee), He = x.end === void 0 ? fe : Math.min(x.end, ee);
                  !H.extend && fe > He && (f = He, He = fe, fe = f);
                  var _ = vf(
                    g,
                    fe
                  ), w = vf(
                    g,
                    He
                  );
                  if (_ && w && (H.rangeCount !== 1 || H.anchorNode !== _.node || H.anchorOffset !== _.offset || H.focusNode !== w.node || H.focusOffset !== w.offset)) {
                    var z = K.createRange();
                    z.setStart(_.node, _.offset), H.removeAllRanges(), fe > He ? (H.addRange(z), H.extend(w.node, w.offset)) : (z.setEnd(w.node, w.offset), H.addRange(z));
                  }
                }
              }
            }
            for (K = [], H = g; H = H.parentNode; )
              H.nodeType === 1 && K.push({
                element: H,
                left: H.scrollLeft,
                top: H.scrollTop
              });
            for (typeof g.focus == "function" && g.focus(), g = 0; g < K.length; g++) {
              var Z = K[g];
              Z.element.scrollLeft = Z.left, Z.element.scrollTop = Z.top;
            }
          }
          Bu = !!yr, br = yr = null;
        } finally {
          Me = i, G.p = l, B.T = n;
        }
      }
      e.current = t, Pe = 2;
    }
  }
  function Nm() {
    if (Pe === 2) {
      Pe = 0;
      var e = Zn, t = fa, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = B.T, B.T = null;
        var l = G.p;
        G.p = 2;
        var i = Me;
        Me |= 4;
        try {
          um(e, t.alternate, t);
        } finally {
          Me = i, G.p = l, B.T = n;
        }
      }
      Pe = 3;
    }
  }
  function Dm() {
    if (Pe === 4 || Pe === 3) {
      Pe = 0, np();
      var e = Zn, t = fa, n = An, l = bm;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Pe = 5 : (Pe = 0, fa = Zn = null, Um(e, e.pendingLanes));
      var i = e.pendingLanes;
      if (i === 0 && (Qn = null), Tc(n), t = t.stateNode, Et && typeof Et.onCommitFiberRoot == "function")
        try {
          Et.onCommitFiberRoot(
            _a,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = B.T, i = G.p, G.p = 2, B.T = null;
        try {
          for (var u = e.onRecoverableError, f = 0; f < l.length; f++) {
            var g = l[f];
            u(g.value, {
              componentStack: g.stack
            });
          }
        } finally {
          B.T = t, G.p = i;
        }
      }
      (An & 3) !== 0 && Cu(), It(e), i = e.pendingLanes, (n & 261930) !== 0 && (i & 42) !== 0 ? e === ir ? ri++ : (ri = 0, ir = e) : ri = 0, si(0);
    }
  }
  function Um(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Qa(t)));
  }
  function Cu() {
    return Mm(), Nm(), Dm(), jm();
  }
  function jm() {
    if (Pe !== 5) return !1;
    var e = Zn, t = lr;
    lr = 0;
    var n = Tc(An), l = B.T, i = G.p;
    try {
      G.p = 32 > n ? 32 : n, B.T = null, n = ar, ar = null;
      var u = Zn, f = An;
      if (Pe = 0, fa = Zn = null, An = 0, (Me & 6) !== 0) throw Error(s(331));
      var g = Me;
      if (Me |= 4, gm(u.current), mm(
        u,
        u.current,
        f,
        n
      ), Me = g, si(0, !1), Et && typeof Et.onPostCommitFiberRoot == "function")
        try {
          Et.onPostCommitFiberRoot(_a, u);
        } catch {
        }
      return !0;
    } finally {
      G.p = i, B.T = l, Um(e, t);
    }
  }
  function Hm(e, t, n) {
    t = Ht(n, t), t = Lo(e.stateNode, t, 2), e = Bn(e, t, 2), e !== null && (za(e, 2), It(e));
  }
  function De(e, t, n) {
    if (e.tag === 3)
      Hm(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Hm(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Qn === null || !Qn.has(l))) {
            e = Ht(n, e), n = Ld(2), l = Bn(t, n, 2), l !== null && (Bd(
              n,
              l,
              t,
              e
            ), za(l, 2), It(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function or(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new _y();
      var i = /* @__PURE__ */ new Set();
      l.set(t, i);
    } else
      i = l.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), l.set(t, i));
    i.has(n) || (er = !0, i.add(n), e = Dy.bind(null, e, t, n), t.then(e, e));
  }
  function Dy(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Le === e && (Ce & n) === n && (Xe === 4 || Xe === 3 && (Ce & 62914560) === Ce && 300 > xt() - Su ? (Me & 2) === 0 && da(e, 0) : tr |= n, sa === Ce && (sa = 0)), It(e);
  }
  function Lm(e, t) {
    t === 0 && (t = zs()), e = vl(e, t), e !== null && (za(e, t), It(e));
  }
  function Uy(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Lm(e, n);
  }
  function jy(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, i = e.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(s(314));
    }
    l !== null && l.delete(t), Lm(e, n);
  }
  function Hy(e, t) {
    return Sc(e, t);
  }
  var Ou = null, ha = null, rr = !1, _u = !1, sr = !1, kn = 0;
  function It(e) {
    e !== ha && e.next === null && (ha === null ? Ou = ha = e : ha = ha.next = e), _u = !0, rr || (rr = !0, By());
  }
  function si(e, t) {
    if (!sr && _u) {
      sr = !0;
      do
        for (var n = !1, l = Ou; l !== null; ) {
          if (e !== 0) {
            var i = l.pendingLanes;
            if (i === 0) var u = 0;
            else {
              var f = l.suspendedLanes, g = l.pingedLanes;
              u = (1 << 31 - At(42 | e) + 1) - 1, u &= i & ~(f & ~g), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, Gm(l, u));
          } else
            u = Ce, u = Ni(
              l,
              l === Le ? u : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (u & 3) === 0 || Ra(l, u) || (n = !0, Gm(l, u));
          l = l.next;
        }
      while (n);
      sr = !1;
    }
  }
  function Ly() {
    Bm();
  }
  function Bm() {
    _u = rr = !1;
    var e = 0;
    kn !== 0 && Jy() && (e = kn);
    for (var t = xt(), n = null, l = Ou; l !== null; ) {
      var i = l.next, u = Ym(l, t);
      u === 0 ? (l.next = null, n === null ? Ou = i : n.next = i, i === null && (ha = n)) : (n = l, (e !== 0 || (u & 3) !== 0) && (_u = !0)), l = i;
    }
    Pe !== 0 && Pe !== 5 || si(e), kn !== 0 && (kn = 0);
  }
  function Ym(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, i = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var f = 31 - At(u), g = 1 << f, x = i[f];
      x === -1 ? ((g & n) === 0 || (g & l) !== 0) && (i[f] = sp(g, t)) : x <= t && (e.expiredLanes |= g), u &= ~g;
    }
    if (t = Le, n = Ce, n = Ni(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, n === 0 || e === t && (Ne === 2 || Ne === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && xc(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || Ra(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && xc(l), Tc(n)) {
        case 2:
        case 8:
          n = _s;
          break;
        case 32:
          n = _i;
          break;
        case 268435456:
          n = Rs;
          break;
        default:
          n = _i;
      }
      return l = qm.bind(null, e), n = Sc(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && xc(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function qm(e, t) {
    if (Pe !== 0 && Pe !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (Cu() && e.callbackNode !== n)
      return null;
    var l = Ce;
    return l = Ni(
      e,
      e === Le ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (xm(e, l, t), Ym(e, xt()), e.callbackNode != null && e.callbackNode === n ? qm.bind(null, e) : null);
  }
  function Gm(e, t) {
    if (Cu()) return null;
    xm(e, t, !0);
  }
  function By() {
    $y(function() {
      (Me & 6) !== 0 ? Sc(
        Os,
        Ly
      ) : Bm();
    });
  }
  function fr() {
    if (kn === 0) {
      var e = Pl;
      e === 0 && (e = Ri, Ri <<= 1, (Ri & 261888) === 0 && (Ri = 256)), kn = e;
    }
    return kn;
  }
  function Vm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Hi("" + e);
  }
  function Xm(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function Yy(e, t, n, l, i) {
    if (t === "submit" && n && n.stateNode === i) {
      var u = Vm(
        (i[dt] || null).action
      ), f = l.submitter;
      f && (t = (t = f[dt] || null) ? Vm(t.formAction) : f.getAttribute("formAction"), t !== null && (u = t, f = null));
      var g = new qi(
        "action",
        "action",
        null,
        l,
        i
      );
      e.push({
        event: g,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (kn !== 0) {
                  var x = f ? Xm(i, f) : new FormData(i);
                  Mo(
                    n,
                    {
                      pending: !0,
                      data: x,
                      method: i.method,
                      action: u
                    },
                    null,
                    x
                  );
                }
              } else
                typeof u == "function" && (g.preventDefault(), x = f ? Xm(i, f) : new FormData(i), Mo(
                  n,
                  {
                    pending: !0,
                    data: x,
                    method: i.method,
                    action: u
                  },
                  u,
                  x
                ));
            },
            currentTarget: i
          }
        ]
      });
    }
  }
  for (var dr = 0; dr < kc.length; dr++) {
    var mr = kc[dr], qy = mr.toLowerCase(), Gy = mr[0].toUpperCase() + mr.slice(1);
    Xt(
      qy,
      "on" + Gy
    );
  }
  Xt(Sf, "onAnimationEnd"), Xt(xf, "onAnimationIteration"), Xt(Ef, "onAnimationStart"), Xt("dblclick", "onDoubleClick"), Xt("focusin", "onFocus"), Xt("focusout", "onBlur"), Xt(ly, "onTransitionRun"), Xt(ay, "onTransitionStart"), Xt(iy, "onTransitionCancel"), Xt(Af, "onTransitionEnd"), Yl("onMouseEnter", ["mouseout", "mouseover"]), Yl("onMouseLeave", ["mouseout", "mouseover"]), Yl("onPointerEnter", ["pointerout", "pointerover"]), Yl("onPointerLeave", ["pointerout", "pointerover"]), fl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), fl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), fl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), fl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), fl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), fl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var fi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Vy = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(fi)
  );
  function Qm(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], i = l.event;
      l = l.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var f = l.length - 1; 0 <= f; f--) {
            var g = l[f], x = g.instance, M = g.currentTarget;
            if (g = g.listener, x !== u && i.isPropagationStopped())
              break e;
            u = g, i.currentTarget = M;
            try {
              u(i);
            } catch (q) {
              Xi(q);
            }
            i.currentTarget = null, u = x;
          }
        else
          for (f = 0; f < l.length; f++) {
            if (g = l[f], x = g.instance, M = g.currentTarget, g = g.listener, x !== u && i.isPropagationStopped())
              break e;
            u = g, i.currentTarget = M;
            try {
              u(i);
            } catch (q) {
              Xi(q);
            }
            i.currentTarget = null, u = x;
          }
      }
    }
  }
  function we(e, t) {
    var n = t[wc];
    n === void 0 && (n = t[wc] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (Zm(t, e, 2, !1), n.add(l));
  }
  function hr(e, t, n) {
    var l = 0;
    t && (l |= 4), Zm(
      n,
      e,
      l,
      t
    );
  }
  var Ru = "_reactListening" + Math.random().toString(36).slice(2);
  function vr(e) {
    if (!e[Ru]) {
      e[Ru] = !0, Ls.forEach(function(n) {
        n !== "selectionchange" && (Vy.has(n) || hr(n, !1, e), hr(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ru] || (t[Ru] = !0, hr("selectionchange", !1, t));
    }
  }
  function Zm(e, t, n, l) {
    switch (Sh(t)) {
      case 2:
        var i = gb;
        break;
      case 8:
        i = pb;
        break;
      default:
        i = zr;
    }
    n = i.bind(
      null,
      t,
      n,
      e
    ), i = void 0, !Uc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), l ? i !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: i
    }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, {
      passive: i
    }) : e.addEventListener(t, n, !1);
  }
  function gr(e, t, n, l, i) {
    var u = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var f = l.tag;
        if (f === 3 || f === 4) {
          var g = l.stateNode.containerInfo;
          if (g === i) break;
          if (f === 4)
            for (f = l.return; f !== null; ) {
              var x = f.tag;
              if ((x === 3 || x === 4) && f.stateNode.containerInfo === i)
                return;
              f = f.return;
            }
          for (; g !== null; ) {
            if (f = Hl(g), f === null) return;
            if (x = f.tag, x === 5 || x === 6 || x === 26 || x === 27) {
              l = u = f;
              continue e;
            }
            g = g.parentNode;
          }
        }
        l = l.return;
      }
    Ws(function() {
      var M = u, q = Nc(n), K = [];
      e: {
        var N = Tf.get(e);
        if (N !== void 0) {
          var H = qi, ee = e;
          switch (e) {
            case "keypress":
              if (Bi(n) === 0) break e;
            case "keydown":
            case "keyup":
              H = jp;
              break;
            case "focusin":
              ee = "focus", H = Bc;
              break;
            case "focusout":
              ee = "blur", H = Bc;
              break;
            case "beforeblur":
            case "afterblur":
              H = Bc;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              H = Is;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              H = Ap;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              H = Bp;
              break;
            case Sf:
            case xf:
            case Ef:
              H = Cp;
              break;
            case Af:
              H = qp;
              break;
            case "scroll":
            case "scrollend":
              H = xp;
              break;
            case "wheel":
              H = Vp;
              break;
            case "copy":
            case "cut":
            case "paste":
              H = _p;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              H = ef;
              break;
            case "toggle":
            case "beforetoggle":
              H = Qp;
          }
          var fe = (t & 4) !== 0, He = !fe && (e === "scroll" || e === "scrollend"), _ = fe ? N !== null ? N + "Capture" : null : N;
          fe = [];
          for (var w = M, z; w !== null; ) {
            var Z = w;
            if (z = Z.stateNode, Z = Z.tag, Z !== 5 && Z !== 26 && Z !== 27 || z === null || _ === null || (Z = Da(w, _), Z != null && fe.push(
              di(w, Z, z)
            )), He) break;
            w = w.return;
          }
          0 < fe.length && (N = new H(
            N,
            ee,
            null,
            n,
            q
          ), K.push({ event: N, listeners: fe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (N = e === "mouseover" || e === "pointerover", H = e === "mouseout" || e === "pointerout", N && n !== Mc && (ee = n.relatedTarget || n.fromElement) && (Hl(ee) || ee[jl]))
            break e;
          if ((H || N) && (N = q.window === q ? q : (N = q.ownerDocument) ? N.defaultView || N.parentWindow : window, H ? (ee = n.relatedTarget || n.toElement, H = M, ee = ee ? Hl(ee) : null, ee !== null && (He = m(ee), fe = ee.tag, ee !== He || fe !== 5 && fe !== 27 && fe !== 6) && (ee = null)) : (H = null, ee = M), H !== ee)) {
            if (fe = Is, Z = "onMouseLeave", _ = "onMouseEnter", w = "mouse", (e === "pointerout" || e === "pointerover") && (fe = ef, Z = "onPointerLeave", _ = "onPointerEnter", w = "pointer"), He = H == null ? N : Na(H), z = ee == null ? N : Na(ee), N = new fe(
              Z,
              w + "leave",
              H,
              n,
              q
            ), N.target = He, N.relatedTarget = z, Z = null, Hl(q) === M && (fe = new fe(
              _,
              w + "enter",
              ee,
              n,
              q
            ), fe.target = z, fe.relatedTarget = He, Z = fe), He = Z, H && ee)
              t: {
                for (fe = Xy, _ = H, w = ee, z = 0, Z = _; Z; Z = fe(Z))
                  z++;
                Z = 0;
                for (var oe = w; oe; oe = fe(oe))
                  Z++;
                for (; 0 < z - Z; )
                  _ = fe(_), z--;
                for (; 0 < Z - z; )
                  w = fe(w), Z--;
                for (; z--; ) {
                  if (_ === w || w !== null && _ === w.alternate) {
                    fe = _;
                    break t;
                  }
                  _ = fe(_), w = fe(w);
                }
                fe = null;
              }
            else fe = null;
            H !== null && Km(
              K,
              N,
              H,
              fe,
              !1
            ), ee !== null && He !== null && Km(
              K,
              He,
              ee,
              fe,
              !0
            );
          }
        }
        e: {
          if (N = M ? Na(M) : window, H = N.nodeName && N.nodeName.toLowerCase(), H === "select" || H === "input" && N.type === "file")
            var Re = rf;
          else if (cf(N))
            if (sf)
              Re = ey;
            else {
              Re = Ip;
              var ie = Fp;
            }
          else
            H = N.nodeName, !H || H.toLowerCase() !== "input" || N.type !== "checkbox" && N.type !== "radio" ? M && zc(M.elementType) && (Re = rf) : Re = Pp;
          if (Re && (Re = Re(e, M))) {
            of(
              K,
              Re,
              n,
              q
            );
            break e;
          }
          ie && ie(e, N, M), e === "focusout" && M && N.type === "number" && M.memoizedProps.value != null && Rc(N, "number", N.value);
        }
        switch (ie = M ? Na(M) : window, e) {
          case "focusin":
            (cf(ie) || ie.contentEditable === "true") && (Zl = ie, Qc = M, Ga = null);
            break;
          case "focusout":
            Ga = Qc = Zl = null;
            break;
          case "mousedown":
            Zc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Zc = !1, yf(K, n, q);
            break;
          case "selectionchange":
            if (ny) break;
          case "keydown":
          case "keyup":
            yf(K, n, q);
        }
        var Se;
        if (qc)
          e: {
            switch (e) {
              case "compositionstart":
                var Oe = "onCompositionStart";
                break e;
              case "compositionend":
                Oe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Oe = "onCompositionUpdate";
                break e;
            }
            Oe = void 0;
          }
        else
          Ql ? af(e, n) && (Oe = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Oe = "onCompositionStart");
        Oe && (tf && n.locale !== "ko" && (Ql || Oe !== "onCompositionStart" ? Oe === "onCompositionEnd" && Ql && (Se = $s()) : (Mn = q, jc = "value" in Mn ? Mn.value : Mn.textContent, Ql = !0)), ie = zu(M, Oe), 0 < ie.length && (Oe = new Ps(
          Oe,
          e,
          null,
          n,
          q
        ), K.push({ event: Oe, listeners: ie }), Se ? Oe.data = Se : (Se = uf(n), Se !== null && (Oe.data = Se)))), (Se = Kp ? kp(e, n) : Jp(e, n)) && (Oe = zu(M, "onBeforeInput"), 0 < Oe.length && (ie = new Ps(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          q
        ), K.push({
          event: ie,
          listeners: Oe
        }), ie.data = Se)), Yy(
          K,
          e,
          M,
          n,
          q
        );
      }
      Qm(K, t);
    });
  }
  function di(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function zu(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var i = e, u = i.stateNode;
      if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || u === null || (i = Da(e, n), i != null && l.unshift(
        di(e, i, u)
      ), i = Da(e, t), i != null && l.push(
        di(e, i, u)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function Xy(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Km(e, t, n, l, i) {
    for (var u = t._reactName, f = []; n !== null && n !== l; ) {
      var g = n, x = g.alternate, M = g.stateNode;
      if (g = g.tag, x !== null && x === l) break;
      g !== 5 && g !== 26 && g !== 27 || M === null || (x = M, i ? (M = Da(n, u), M != null && f.unshift(
        di(n, M, x)
      )) : i || (M = Da(n, u), M != null && f.push(
        di(n, M, x)
      ))), n = n.return;
    }
    f.length !== 0 && e.push({ event: t, listeners: f });
  }
  var Qy = /\r\n?/g, Zy = /\u0000|\uFFFD/g;
  function km(e) {
    return (typeof e == "string" ? e : "" + e).replace(Qy, `
`).replace(Zy, "");
  }
  function Jm(e, t) {
    return t = km(t), km(e) === t;
  }
  function je(e, t, n, l, i, u) {
    switch (n) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || Gl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && Gl(e, "" + l);
        break;
      case "className":
        Ui(e, "class", l);
        break;
      case "tabIndex":
        Ui(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ui(e, n, l);
        break;
      case "style":
        ks(e, l, u);
        break;
      case "data":
        if (t !== "object") {
          Ui(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = Hi("" + l), e.setAttribute(n, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (t !== "input" && je(e, t, "name", i.name, i, null), je(
            e,
            t,
            "formEncType",
            i.formEncType,
            i,
            null
          ), je(
            e,
            t,
            "formMethod",
            i.formMethod,
            i,
            null
          ), je(
            e,
            t,
            "formTarget",
            i.formTarget,
            i,
            null
          )) : (je(e, t, "encType", i.encType, i, null), je(e, t, "method", i.method, i, null), je(e, t, "target", i.target, i, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = Hi("" + l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = on);
        break;
      case "onScroll":
        l != null && we("scroll", e);
        break;
      case "onScrollEnd":
        l != null && we("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(s(61));
          if (n = l.__html, n != null) {
            if (i.children != null) throw Error(s(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = Hi("" + l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "" + l) : e.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(n, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(n) : e.setAttribute(n, l);
        break;
      case "popover":
        we("beforetoggle", e), we("toggle", e), Di(e, "popover", l);
        break;
      case "xlinkActuate":
        cn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        cn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        cn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        cn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        cn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        cn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        cn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        cn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        cn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        Di(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = bp.get(n) || n, Di(e, n, l));
    }
  }
  function pr(e, t, n, l, i, u) {
    switch (n) {
      case "style":
        ks(e, l, u);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(s(61));
          if (n = l.__html, n != null) {
            if (i.children != null) throw Error(s(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof l == "string" ? Gl(e, l) : (typeof l == "number" || typeof l == "bigint") && Gl(e, "" + l);
        break;
      case "onScroll":
        l != null && we("scroll", e);
        break;
      case "onScrollEnd":
        l != null && we("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = on);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Bs.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), u = e[dt] || null, u = u != null ? u[n] : null, typeof u == "function" && e.removeEventListener(t, u, i), typeof l == "function")) {
              typeof u != "function" && u !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, l, i);
              break e;
            }
            n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : Di(e, n, l);
          }
    }
  }
  function ot(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        we("error", e), we("load", e);
        var l = !1, i = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var f = n[u];
            if (f != null)
              switch (u) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(s(137, t));
                default:
                  je(e, t, u, f, n, null);
              }
          }
        i && je(e, t, "srcSet", n.srcSet, n, null), l && je(e, t, "src", n.src, n, null);
        return;
      case "input":
        we("invalid", e);
        var g = u = f = i = null, x = null, M = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var q = n[l];
            if (q != null)
              switch (l) {
                case "name":
                  i = q;
                  break;
                case "type":
                  f = q;
                  break;
                case "checked":
                  x = q;
                  break;
                case "defaultChecked":
                  M = q;
                  break;
                case "value":
                  u = q;
                  break;
                case "defaultValue":
                  g = q;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (q != null)
                    throw Error(s(137, t));
                  break;
                default:
                  je(e, t, l, q, n, null);
              }
          }
        Xs(
          e,
          u,
          g,
          x,
          M,
          f,
          i,
          !1
        );
        return;
      case "select":
        we("invalid", e), l = f = u = null;
        for (i in n)
          if (n.hasOwnProperty(i) && (g = n[i], g != null))
            switch (i) {
              case "value":
                u = g;
                break;
              case "defaultValue":
                f = g;
                break;
              case "multiple":
                l = g;
              default:
                je(e, t, i, g, n, null);
            }
        t = u, n = f, e.multiple = !!l, t != null ? ql(e, !!l, t, !1) : n != null && ql(e, !!l, n, !0);
        return;
      case "textarea":
        we("invalid", e), u = i = l = null;
        for (f in n)
          if (n.hasOwnProperty(f) && (g = n[f], g != null))
            switch (f) {
              case "value":
                l = g;
                break;
              case "defaultValue":
                i = g;
                break;
              case "children":
                u = g;
                break;
              case "dangerouslySetInnerHTML":
                if (g != null) throw Error(s(91));
                break;
              default:
                je(e, t, f, g, n, null);
            }
        Zs(e, l, i, u);
        return;
      case "option":
        for (x in n)
          if (n.hasOwnProperty(x) && (l = n[x], l != null))
            switch (x) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                je(e, t, x, l, n, null);
            }
        return;
      case "dialog":
        we("beforetoggle", e), we("toggle", e), we("cancel", e), we("close", e);
        break;
      case "iframe":
      case "object":
        we("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < fi.length; l++)
          we(fi[l], e);
        break;
      case "image":
        we("error", e), we("load", e);
        break;
      case "details":
        we("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        we("error", e), we("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (M in n)
          if (n.hasOwnProperty(M) && (l = n[M], l != null))
            switch (M) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(s(137, t));
              default:
                je(e, t, M, l, n, null);
            }
        return;
      default:
        if (zc(t)) {
          for (q in n)
            n.hasOwnProperty(q) && (l = n[q], l !== void 0 && pr(
              e,
              t,
              q,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (g in n)
      n.hasOwnProperty(g) && (l = n[g], l != null && je(e, t, g, l, n, null));
  }
  function Ky(e, t, n, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var i = null, u = null, f = null, g = null, x = null, M = null, q = null;
        for (H in n) {
          var K = n[H];
          if (n.hasOwnProperty(H) && K != null)
            switch (H) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                x = K;
              default:
                l.hasOwnProperty(H) || je(e, t, H, null, l, K);
            }
        }
        for (var N in l) {
          var H = l[N];
          if (K = n[N], l.hasOwnProperty(N) && (H != null || K != null))
            switch (N) {
              case "type":
                u = H;
                break;
              case "name":
                i = H;
                break;
              case "checked":
                M = H;
                break;
              case "defaultChecked":
                q = H;
                break;
              case "value":
                f = H;
                break;
              case "defaultValue":
                g = H;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (H != null)
                  throw Error(s(137, t));
                break;
              default:
                H !== K && je(
                  e,
                  t,
                  N,
                  H,
                  l,
                  K
                );
            }
        }
        _c(
          e,
          f,
          g,
          x,
          M,
          q,
          u,
          i
        );
        return;
      case "select":
        H = f = g = N = null;
        for (u in n)
          if (x = n[u], n.hasOwnProperty(u) && x != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                H = x;
              default:
                l.hasOwnProperty(u) || je(
                  e,
                  t,
                  u,
                  null,
                  l,
                  x
                );
            }
        for (i in l)
          if (u = l[i], x = n[i], l.hasOwnProperty(i) && (u != null || x != null))
            switch (i) {
              case "value":
                N = u;
                break;
              case "defaultValue":
                g = u;
                break;
              case "multiple":
                f = u;
              default:
                u !== x && je(
                  e,
                  t,
                  i,
                  u,
                  l,
                  x
                );
            }
        t = g, n = f, l = H, N != null ? ql(e, !!n, N, !1) : !!l != !!n && (t != null ? ql(e, !!n, t, !0) : ql(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        H = N = null;
        for (g in n)
          if (i = n[g], n.hasOwnProperty(g) && i != null && !l.hasOwnProperty(g))
            switch (g) {
              case "value":
                break;
              case "children":
                break;
              default:
                je(e, t, g, null, l, i);
            }
        for (f in l)
          if (i = l[f], u = n[f], l.hasOwnProperty(f) && (i != null || u != null))
            switch (f) {
              case "value":
                N = i;
                break;
              case "defaultValue":
                H = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(s(91));
                break;
              default:
                i !== u && je(e, t, f, i, l, u);
            }
        Qs(e, N, H);
        return;
      case "option":
        for (var ee in n)
          if (N = n[ee], n.hasOwnProperty(ee) && N != null && !l.hasOwnProperty(ee))
            switch (ee) {
              case "selected":
                e.selected = !1;
                break;
              default:
                je(
                  e,
                  t,
                  ee,
                  null,
                  l,
                  N
                );
            }
        for (x in l)
          if (N = l[x], H = n[x], l.hasOwnProperty(x) && N !== H && (N != null || H != null))
            switch (x) {
              case "selected":
                e.selected = N && typeof N != "function" && typeof N != "symbol";
                break;
              default:
                je(
                  e,
                  t,
                  x,
                  N,
                  l,
                  H
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var fe in n)
          N = n[fe], n.hasOwnProperty(fe) && N != null && !l.hasOwnProperty(fe) && je(e, t, fe, null, l, N);
        for (M in l)
          if (N = l[M], H = n[M], l.hasOwnProperty(M) && N !== H && (N != null || H != null))
            switch (M) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (N != null)
                  throw Error(s(137, t));
                break;
              default:
                je(
                  e,
                  t,
                  M,
                  N,
                  l,
                  H
                );
            }
        return;
      default:
        if (zc(t)) {
          for (var He in n)
            N = n[He], n.hasOwnProperty(He) && N !== void 0 && !l.hasOwnProperty(He) && pr(
              e,
              t,
              He,
              void 0,
              l,
              N
            );
          for (q in l)
            N = l[q], H = n[q], !l.hasOwnProperty(q) || N === H || N === void 0 && H === void 0 || pr(
              e,
              t,
              q,
              N,
              l,
              H
            );
          return;
        }
    }
    for (var _ in n)
      N = n[_], n.hasOwnProperty(_) && N != null && !l.hasOwnProperty(_) && je(e, t, _, null, l, N);
    for (K in l)
      N = l[K], H = n[K], !l.hasOwnProperty(K) || N === H || N == null && H == null || je(e, t, K, N, l, H);
  }
  function Wm(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function ky() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var i = n[l], u = i.transferSize, f = i.initiatorType, g = i.duration;
        if (u && g && Wm(f)) {
          for (f = 0, g = i.responseEnd, l += 1; l < n.length; l++) {
            var x = n[l], M = x.startTime;
            if (M > g) break;
            var q = x.transferSize, K = x.initiatorType;
            q && Wm(K) && (x = x.responseEnd, f += q * (x < g ? 1 : (g - M) / (x - M)));
          }
          if (--l, t += 8 * (u + f) / (i.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var yr = null, br = null;
  function Mu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function $m(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Fm(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Sr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var xr = null;
  function Jy() {
    var e = window.event;
    return e && e.type === "popstate" ? e === xr ? !1 : (xr = e, !0) : (xr = null, !1);
  }
  var Im = typeof setTimeout == "function" ? setTimeout : void 0, Wy = typeof clearTimeout == "function" ? clearTimeout : void 0, Pm = typeof Promise == "function" ? Promise : void 0, $y = typeof queueMicrotask == "function" ? queueMicrotask : typeof Pm < "u" ? function(e) {
    return Pm.resolve(null).then(e).catch(Fy);
  } : Im;
  function Fy(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Jn(e) {
    return e === "head";
  }
  function eh(e, t) {
    var n = t, l = 0;
    do {
      var i = n.nextSibling;
      if (e.removeChild(n), i && i.nodeType === 8)
        if (n = i.data, n === "/$" || n === "/&") {
          if (l === 0) {
            e.removeChild(i), ya(t);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          mi(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, mi(n);
          for (var u = n.firstChild; u; ) {
            var f = u.nextSibling, g = u.nodeName;
            u[Ma] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && u.rel.toLowerCase() === "stylesheet" || n.removeChild(u), u = f;
          }
        } else
          n === "body" && mi(e.ownerDocument.body);
      n = i;
    } while (n);
    ya(t);
  }
  function th(e, t) {
    var n = e;
    e = 0;
    do {
      var l = n.nextSibling;
      if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), l && l.nodeType === 8)
        if (n = l.data, n === "/$") {
          if (e === 0) break;
          e--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
      n = l;
    } while (n);
  }
  function Er(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Er(n), Cc(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function Iy(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var i = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[Ma])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = Gt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Py(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Gt(e.nextSibling), e === null)) return null;
    return e;
  }
  function nh(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Gt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Ar(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Tr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function eb(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading")
      t();
    else {
      var l = function() {
        t(), n.removeEventListener("DOMContentLoaded", l);
      };
      n.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function Gt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var wr = null;
  function lh(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return Gt(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function ah(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (t === 0) return e;
          t--;
        } else n !== "/$" && n !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function ih(e, t, n) {
    switch (t = Mu(n), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(s(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(s(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(s(454));
        return e;
      default:
        throw Error(s(451));
    }
  }
  function mi(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Cc(e);
  }
  var Vt = /* @__PURE__ */ new Map(), uh = /* @__PURE__ */ new Set();
  function Nu(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Tn = G.d;
  G.d = {
    f: tb,
    r: nb,
    D: lb,
    C: ab,
    L: ib,
    m: ub,
    X: ob,
    S: cb,
    M: rb
  };
  function tb() {
    var e = Tn.f(), t = Au();
    return e || t;
  }
  function nb(e) {
    var t = Ll(e);
    t !== null && t.tag === 5 && t.type === "form" ? Ad(t) : Tn.r(e);
  }
  var va = typeof document > "u" ? null : document;
  function ch(e, t, n) {
    var l = va;
    if (l && typeof t == "string" && t) {
      var i = Ut(t);
      i = 'link[rel="' + e + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), uh.has(i) || (uh.add(i), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(i) === null && (t = l.createElement("link"), ot(t, "link", e), nt(t), l.head.appendChild(t)));
    }
  }
  function lb(e) {
    Tn.D(e), ch("dns-prefetch", e, null);
  }
  function ab(e, t) {
    Tn.C(e, t), ch("preconnect", e, t);
  }
  function ib(e, t, n) {
    Tn.L(e, t, n);
    var l = va;
    if (l && e && t) {
      var i = 'link[rel="preload"][as="' + Ut(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + Ut(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + Ut(
        n.imageSizes
      ) + '"]')) : i += '[href="' + Ut(e) + '"]';
      var u = i;
      switch (t) {
        case "style":
          u = ga(e);
          break;
        case "script":
          u = pa(e);
      }
      Vt.has(u) || (e = A(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), Vt.set(u, e), l.querySelector(i) !== null || t === "style" && l.querySelector(hi(u)) || t === "script" && l.querySelector(vi(u)) || (t = l.createElement("link"), ot(t, "link", e), nt(t), l.head.appendChild(t)));
    }
  }
  function ub(e, t) {
    Tn.m(e, t);
    var n = va;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", i = 'link[rel="modulepreload"][as="' + Ut(l) + '"][href="' + Ut(e) + '"]', u = i;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = pa(e);
      }
      if (!Vt.has(u) && (e = A({ rel: "modulepreload", href: e }, t), Vt.set(u, e), n.querySelector(i) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(vi(u)))
              return;
        }
        l = n.createElement("link"), ot(l, "link", e), nt(l), n.head.appendChild(l);
      }
    }
  }
  function cb(e, t, n) {
    Tn.S(e, t, n);
    var l = va;
    if (l && e) {
      var i = Bl(l).hoistableStyles, u = ga(e);
      t = t || "default";
      var f = i.get(u);
      if (!f) {
        var g = { loading: 0, preload: null };
        if (f = l.querySelector(
          hi(u)
        ))
          g.loading = 5;
        else {
          e = A(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = Vt.get(u)) && Cr(e, n);
          var x = f = l.createElement("link");
          nt(x), ot(x, "link", e), x._p = new Promise(function(M, q) {
            x.onload = M, x.onerror = q;
          }), x.addEventListener("load", function() {
            g.loading |= 1;
          }), x.addEventListener("error", function() {
            g.loading |= 2;
          }), g.loading |= 4, Du(f, t, l);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: g
        }, i.set(u, f);
      }
    }
  }
  function ob(e, t) {
    Tn.X(e, t);
    var n = va;
    if (n && e) {
      var l = Bl(n).hoistableScripts, i = pa(e), u = l.get(i);
      u || (u = n.querySelector(vi(i)), u || (e = A({ src: e, async: !0 }, t), (t = Vt.get(i)) && Or(e, t), u = n.createElement("script"), nt(u), ot(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(i, u));
    }
  }
  function rb(e, t) {
    Tn.M(e, t);
    var n = va;
    if (n && e) {
      var l = Bl(n).hoistableScripts, i = pa(e), u = l.get(i);
      u || (u = n.querySelector(vi(i)), u || (e = A({ src: e, async: !0, type: "module" }, t), (t = Vt.get(i)) && Or(e, t), u = n.createElement("script"), nt(u), ot(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(i, u));
    }
  }
  function oh(e, t, n, l) {
    var i = (i = F.current) ? Nu(i) : null;
    if (!i) throw Error(s(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = ga(n.href), n = Bl(
          i
        ).hoistableStyles, l = n.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = ga(n.href);
          var u = Bl(
            i
          ).hoistableStyles, f = u.get(e);
          if (f || (i = i.ownerDocument || i, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, f), (u = i.querySelector(
            hi(e)
          )) && !u._p && (f.instance = u, f.state.loading = 5), Vt.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Vt.set(e, n), u || sb(
            i,
            e,
            n,
            f.state
          ))), t && l === null)
            throw Error(s(528, ""));
          return f;
        }
        if (t && l !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = pa(n), n = Bl(
          i
        ).hoistableScripts, l = n.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(s(444, e));
    }
  }
  function ga(e) {
    return 'href="' + Ut(e) + '"';
  }
  function hi(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function rh(e) {
    return A({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function sb(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), ot(t, "link", n), nt(t), e.head.appendChild(t));
  }
  function pa(e) {
    return '[src="' + Ut(e) + '"]';
  }
  function vi(e) {
    return "script[async]" + e;
  }
  function sh(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + Ut(n.href) + '"]'
          );
          if (l)
            return t.instance = l, nt(l), l;
          var i = A({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), nt(l), ot(l, "style", i), Du(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          i = ga(n.href);
          var u = e.querySelector(
            hi(i)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, nt(u), u;
          l = rh(n), (i = Vt.get(i)) && Cr(l, i), u = (e.ownerDocument || e).createElement("link"), nt(u);
          var f = u;
          return f._p = new Promise(function(g, x) {
            f.onload = g, f.onerror = x;
          }), ot(u, "link", l), t.state.loading |= 4, Du(u, n.precedence, e), t.instance = u;
        case "script":
          return u = pa(n.src), (i = e.querySelector(
            vi(u)
          )) ? (t.instance = i, nt(i), i) : (l = n, (i = Vt.get(u)) && (l = A({}, n), Or(l, i)), e = e.ownerDocument || e, i = e.createElement("script"), nt(i), ot(i, "link", l), e.head.appendChild(i), t.instance = i);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, Du(l, n.precedence, e));
    return t.instance;
  }
  function Du(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), i = l.length ? l[l.length - 1] : null, u = i, f = 0; f < l.length; f++) {
      var g = l[f];
      if (g.dataset.precedence === t) u = g;
      else if (u !== i) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function Cr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Or(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Uu = null;
  function fh(e, t, n) {
    if (Uu === null) {
      var l = /* @__PURE__ */ new Map(), i = Uu = /* @__PURE__ */ new Map();
      i.set(n, l);
    } else
      i = Uu, l = i.get(n), l || (l = /* @__PURE__ */ new Map(), i.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
      var u = n[i];
      if (!(u[Ma] || u[at] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = u.getAttribute(t) || "";
        f = e + f;
        var g = l.get(f);
        g ? g.push(u) : l.set(f, [u]);
      }
    }
    return l;
  }
  function dh(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function fb(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function mh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function db(e, t, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var i = ga(l.href), u = t.querySelector(
          hi(i)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = ju.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = u, nt(u);
          return;
        }
        u = t.ownerDocument || t, l = rh(l), (i = Vt.get(i)) && Cr(l, i), u = u.createElement("link"), nt(u);
        var f = u;
        f._p = new Promise(function(g, x) {
          f.onload = g, f.onerror = x;
        }), ot(u, "link", l), n.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = ju.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var _r = 0;
  function mb(e, t) {
    return e.stylesheets && e.count === 0 && Lu(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (e.stylesheets && Lu(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && _r === 0 && (_r = 62500 * ky());
      var i = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Lu(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > _r ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(i);
      };
    } : null;
  }
  function ju() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Lu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Hu = null;
  function Lu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Hu = /* @__PURE__ */ new Map(), t.forEach(hb, e), Hu = null, ju.call(e));
  }
  function hb(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Hu.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Hu.set(e, n);
        for (var i = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < i.length; u++) {
          var f = i[u];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (n.set(f.dataset.precedence, f), l = f);
        }
        l && n.set(null, l);
      }
      i = t.instance, f = i.getAttribute("data-precedence"), u = n.get(f) || l, u === l && n.set(null, i), n.set(f, i), this.count++, l = ju.bind(this), i.addEventListener("load", l), i.addEventListener("error", l), u ? u.parentNode.insertBefore(i, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
    }
  }
  var gi = {
    $$typeof: Y,
    Provider: null,
    Consumer: null,
    _currentValue: le,
    _currentValue2: le,
    _threadCount: 0
  };
  function vb(e, t, n, l, i, u, f, g, x) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ec(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ec(0), this.hiddenUpdates = Ec(null), this.identifierPrefix = l, this.onUncaughtError = i, this.onCaughtError = u, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = x, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function hh(e, t, n, l, i, u, f, g, x, M, q, K) {
    return e = new vb(
      e,
      t,
      n,
      f,
      x,
      M,
      q,
      K,
      g
    ), t = 1, u === !0 && (t |= 24), u = wt(3, null, null, t), e.current = u, u.stateNode = e, t = uo(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, so(u), e;
  }
  function vh(e) {
    return e ? (e = Jl, e) : Jl;
  }
  function gh(e, t, n, l, i, u) {
    i = vh(i), l.context === null ? l.context = i : l.pendingContext = i, l = Ln(t), l.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (l.callback = u), n = Bn(e, l, t), n !== null && (yt(n, e, t), Ja(n, e, t));
  }
  function ph(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Rr(e, t) {
    ph(e, t), (e = e.alternate) && ph(e, t);
  }
  function yh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = vl(e, 67108864);
      t !== null && yt(t, e, 67108864), Rr(e, 67108864);
    }
  }
  function bh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = zt();
      t = Ac(t);
      var n = vl(e, t);
      n !== null && yt(n, e, t), Rr(e, t);
    }
  }
  var Bu = !0;
  function gb(e, t, n, l) {
    var i = B.T;
    B.T = null;
    var u = G.p;
    try {
      G.p = 2, zr(e, t, n, l);
    } finally {
      G.p = u, B.T = i;
    }
  }
  function pb(e, t, n, l) {
    var i = B.T;
    B.T = null;
    var u = G.p;
    try {
      G.p = 8, zr(e, t, n, l);
    } finally {
      G.p = u, B.T = i;
    }
  }
  function zr(e, t, n, l) {
    if (Bu) {
      var i = Mr(l);
      if (i === null)
        gr(
          e,
          t,
          l,
          Yu,
          n
        ), xh(e, l);
      else if (bb(
        i,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (xh(e, l), t & 4 && -1 < yb.indexOf(e)) {
        for (; i !== null; ) {
          var u = Ll(i);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var f = sl(u.pendingLanes);
                  if (f !== 0) {
                    var g = u;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; f; ) {
                      var x = 1 << 31 - At(f);
                      g.entanglements[1] |= x, f &= ~x;
                    }
                    It(u), (Me & 6) === 0 && (xu = xt() + 500, si(0));
                  }
                }
                break;
              case 31:
              case 13:
                g = vl(u, 2), g !== null && yt(g, u, 2), Au(), Rr(u, 2);
            }
          if (u = Mr(l), u === null && gr(
            e,
            t,
            l,
            Yu,
            n
          ), u === i) break;
          i = u;
        }
        i !== null && l.stopPropagation();
      } else
        gr(
          e,
          t,
          l,
          null,
          n
        );
    }
  }
  function Mr(e) {
    return e = Nc(e), Nr(e);
  }
  var Yu = null;
  function Nr(e) {
    if (Yu = null, e = Hl(e), e !== null) {
      var t = m(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = v(t), e !== null) return e;
          e = null;
        } else if (n === 31) {
          if (e = p(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Yu = e, null;
  }
  function Sh(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (lp()) {
          case Os:
            return 2;
          case _s:
            return 8;
          case _i:
          case ap:
            return 32;
          case Rs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Dr = !1, Wn = null, $n = null, Fn = null, pi = /* @__PURE__ */ new Map(), yi = /* @__PURE__ */ new Map(), In = [], yb = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function xh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Wn = null;
        break;
      case "dragenter":
      case "dragleave":
        $n = null;
        break;
      case "mouseover":
      case "mouseout":
        Fn = null;
        break;
      case "pointerover":
      case "pointerout":
        pi.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        yi.delete(t.pointerId);
    }
  }
  function bi(e, t, n, l, i, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: u,
      targetContainers: [i]
    }, t !== null && (t = Ll(t), t !== null && yh(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
  }
  function bb(e, t, n, l, i) {
    switch (t) {
      case "focusin":
        return Wn = bi(
          Wn,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "dragenter":
        return $n = bi(
          $n,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "mouseover":
        return Fn = bi(
          Fn,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "pointerover":
        var u = i.pointerId;
        return pi.set(
          u,
          bi(
            pi.get(u) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
      case "gotpointercapture":
        return u = i.pointerId, yi.set(
          u,
          bi(
            yi.get(u) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
    }
    return !1;
  }
  function Eh(e) {
    var t = Hl(e.target);
    if (t !== null) {
      var n = m(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = v(n), t !== null) {
            e.blockedOn = t, js(e.priority, function() {
              bh(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = p(n), t !== null) {
            e.blockedOn = t, js(e.priority, function() {
              bh(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function qu(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Mr(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        Mc = l, n.target.dispatchEvent(l), Mc = null;
      } else
        return t = Ll(n), t !== null && yh(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Ah(e, t, n) {
    qu(e) && n.delete(t);
  }
  function Sb() {
    Dr = !1, Wn !== null && qu(Wn) && (Wn = null), $n !== null && qu($n) && ($n = null), Fn !== null && qu(Fn) && (Fn = null), pi.forEach(Ah), yi.forEach(Ah);
  }
  function Gu(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Dr || (Dr = !0, c.unstable_scheduleCallback(
      c.unstable_NormalPriority,
      Sb
    )));
  }
  var Vu = null;
  function Th(e) {
    Vu !== e && (Vu = e, c.unstable_scheduleCallback(
      c.unstable_NormalPriority,
      function() {
        Vu === e && (Vu = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], i = e[t + 2];
          if (typeof l != "function") {
            if (Nr(l || n) === null)
              continue;
            break;
          }
          var u = Ll(n);
          u !== null && (e.splice(t, 3), t -= 3, Mo(
            u,
            {
              pending: !0,
              data: i,
              method: n.method,
              action: l
            },
            l,
            i
          ));
        }
      }
    ));
  }
  function ya(e) {
    function t(x) {
      return Gu(x, e);
    }
    Wn !== null && Gu(Wn, e), $n !== null && Gu($n, e), Fn !== null && Gu(Fn, e), pi.forEach(t), yi.forEach(t);
    for (var n = 0; n < In.length; n++) {
      var l = In[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < In.length && (n = In[0], n.blockedOn === null); )
      Eh(n), n.blockedOn === null && In.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var i = n[l], u = n[l + 1], f = i[dt] || null;
        if (typeof u == "function")
          f || Th(n);
        else if (f) {
          var g = null;
          if (u && u.hasAttribute("formAction")) {
            if (i = u, f = u[dt] || null)
              g = f.formAction;
            else if (Nr(i) !== null) continue;
          } else g = f.action;
          typeof g == "function" ? n[l + 1] = g : (n.splice(l, 3), l -= 3), Th(n);
        }
      }
  }
  function wh() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(f) {
            return i = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      i !== null && (i(), i = null), l || setTimeout(n, 20);
    }
    function n() {
      if (!l && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, i = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
      };
    }
  }
  function Ur(e) {
    this._internalRoot = e;
  }
  Xu.prototype.render = Ur.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var n = t.current, l = zt();
    gh(n, l, e, t, null, null);
  }, Xu.prototype.unmount = Ur.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      gh(e.current, 2, null, e, null, null), Au(), t[jl] = null;
    }
  };
  function Xu(e) {
    this._internalRoot = e;
  }
  Xu.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Us();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < In.length && t !== 0 && t < In[n].priority; n++) ;
      In.splice(n, 0, e), n === 0 && Eh(e);
    }
  };
  var Ch = o.version;
  if (Ch !== "19.2.6")
    throw Error(
      s(
        527,
        Ch,
        "19.2.6"
      )
    );
  G.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = b(t), e = e !== null ? E(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var xb = {
    bundleType: 0,
    version: "19.2.6",
    rendererPackageName: "react-dom",
    currentDispatcherRef: B,
    reconcilerVersion: "19.2.6"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qu.isDisabled && Qu.supportsFiber)
      try {
        _a = Qu.inject(
          xb
        ), Et = Qu;
      } catch {
      }
  }
  return xi.createRoot = function(e, t) {
    if (!d(e)) throw Error(s(299));
    var n = !1, l = "", i = Dd, u = Ud, f = jd;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = hh(
      e,
      1,
      !1,
      null,
      null,
      n,
      l,
      null,
      i,
      u,
      f,
      wh
    ), e[jl] = t.current, vr(e), new Ur(t);
  }, xi.hydrateRoot = function(e, t, n) {
    if (!d(e)) throw Error(s(299));
    var l = !1, i = "", u = Dd, f = Ud, g = jd, x = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (f = n.onCaughtError), n.onRecoverableError !== void 0 && (g = n.onRecoverableError), n.formState !== void 0 && (x = n.formState)), t = hh(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      i,
      x,
      u,
      f,
      g,
      wh
    ), t.context = vh(null), n = t.current, l = zt(), l = Ac(l), i = Ln(l), i.callback = null, Bn(n, i, l), n = l, t.current.lanes = n, za(t, n), It(t), e[jl] = t.current, vr(e), new Xu(t);
  }, xi.version = "19.2.6", xi;
}
var Hh;
function Mb() {
  if (Hh) return Hr.exports;
  Hh = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (c) {
        console.error(c);
      }
  }
  return a(), Hr.exports = zb(), Hr.exports;
}
var Nb = Mb();
function Db(a) {
  return (c, o) => {
    const r = Nb.createRoot(c);
    return r.render(/* @__PURE__ */ L.jsx(a, { sdk: o })), {
      update(s) {
        r.render(/* @__PURE__ */ L.jsx(a, { sdk: s }));
      },
      unmount() {
        r.unmount();
      }
    };
  };
}
var y = fs();
const nl = /* @__PURE__ */ bv(y), ds = /* @__PURE__ */ Ab({
  __proto__: null,
  default: nl
}, [y]);
function Ub(a, c) {
  return y.useMemo(() => c in a ? a[c] : a.en ?? a[Object.keys(a)[0]], [a, c]);
}
function xv(a) {
  var c, o, r = "";
  if (typeof a == "string" || typeof a == "number") r += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var s = a.length;
    for (c = 0; c < s; c++) a[c] && (o = xv(a[c])) && (r && (r += " "), r += o);
  } else for (o in a) a[o] && (r && (r += " "), r += o);
  return r;
}
function Ev() {
  for (var a, c, o = 0, r = "", s = arguments.length; o < s; o++) (a = arguments[o]) && (c = xv(a)) && (r && (r += " "), r += c);
  return r;
}
const jb = (a, c) => {
  const o = new Array(a.length + c.length);
  for (let r = 0; r < a.length; r++)
    o[r] = a[r];
  for (let r = 0; r < c.length; r++)
    o[a.length + r] = c[r];
  return o;
}, Hb = (a, c) => ({
  classGroupId: a,
  validator: c
}), Av = (a = /* @__PURE__ */ new Map(), c = null, o) => ({
  nextPart: a,
  validators: c,
  classGroupId: o
}), tc = "-", Lh = [], Lb = "arbitrary..", Bb = (a) => {
  const c = qb(a), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: r
  } = a;
  return {
    getClassGroupId: (m) => {
      if (m.startsWith("[") && m.endsWith("]"))
        return Yb(m);
      const v = m.split(tc), p = v[0] === "" && v.length > 1 ? 1 : 0;
      return Tv(v, p, c);
    },
    getConflictingClassGroupIds: (m, v) => {
      if (v) {
        const p = r[m], h = o[m];
        return p ? h ? jb(h, p) : p : h || Lh;
      }
      return o[m] || Lh;
    }
  };
}, Tv = (a, c, o) => {
  if (a.length - c === 0)
    return o.classGroupId;
  const s = a[c], d = o.nextPart.get(s);
  if (d) {
    const h = Tv(a, c + 1, d);
    if (h) return h;
  }
  const m = o.validators;
  if (m === null)
    return;
  const v = c === 0 ? a.join(tc) : a.slice(c).join(tc), p = m.length;
  for (let h = 0; h < p; h++) {
    const b = m[h];
    if (b.validator(v))
      return b.classGroupId;
  }
}, Yb = (a) => a.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const c = a.slice(1, -1), o = c.indexOf(":"), r = c.slice(0, o);
  return r ? Lb + r : void 0;
})(), qb = (a) => {
  const {
    theme: c,
    classGroups: o
  } = a;
  return Gb(o, c);
}, Gb = (a, c) => {
  const o = Av();
  for (const r in a) {
    const s = a[r];
    ms(s, o, r, c);
  }
  return o;
}, ms = (a, c, o, r) => {
  const s = a.length;
  for (let d = 0; d < s; d++) {
    const m = a[d];
    Vb(m, c, o, r);
  }
}, Vb = (a, c, o, r) => {
  if (typeof a == "string") {
    Xb(a, c, o);
    return;
  }
  if (typeof a == "function") {
    Qb(a, c, o, r);
    return;
  }
  Zb(a, c, o, r);
}, Xb = (a, c, o) => {
  const r = a === "" ? c : wv(c, a);
  r.classGroupId = o;
}, Qb = (a, c, o, r) => {
  if (Kb(a)) {
    ms(a(r), c, o, r);
    return;
  }
  c.validators === null && (c.validators = []), c.validators.push(Hb(o, a));
}, Zb = (a, c, o, r) => {
  const s = Object.entries(a), d = s.length;
  for (let m = 0; m < d; m++) {
    const [v, p] = s[m];
    ms(p, wv(c, v), o, r);
  }
}, wv = (a, c) => {
  let o = a;
  const r = c.split(tc), s = r.length;
  for (let d = 0; d < s; d++) {
    const m = r[d];
    let v = o.nextPart.get(m);
    v || (v = Av(), o.nextPart.set(m, v)), o = v;
  }
  return o;
}, Kb = (a) => "isThemeGetter" in a && a.isThemeGetter === !0, kb = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let c = 0, o = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const s = (d, m) => {
    o[d] = m, c++, c > a && (c = 0, r = o, o = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(d) {
      let m = o[d];
      if (m !== void 0)
        return m;
      if ((m = r[d]) !== void 0)
        return s(d, m), m;
    },
    set(d, m) {
      d in o ? o[d] = m : s(d, m);
    }
  };
}, Pr = "!", Bh = ":", Jb = [], Yh = (a, c, o, r, s) => ({
  modifiers: a,
  hasImportantModifier: c,
  baseClassName: o,
  maybePostfixModifierPosition: r,
  isExternal: s
}), Wb = (a) => {
  const {
    prefix: c,
    experimentalParseClassName: o
  } = a;
  let r = (s) => {
    const d = [];
    let m = 0, v = 0, p = 0, h;
    const b = s.length;
    for (let S = 0; S < b; S++) {
      const C = s[S];
      if (m === 0 && v === 0) {
        if (C === Bh) {
          d.push(s.slice(p, S)), p = S + 1;
          continue;
        }
        if (C === "/") {
          h = S;
          continue;
        }
      }
      C === "[" ? m++ : C === "]" ? m-- : C === "(" ? v++ : C === ")" && v--;
    }
    const E = d.length === 0 ? s : s.slice(p);
    let A = E, R = !1;
    E.endsWith(Pr) ? (A = E.slice(0, -1), R = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      E.startsWith(Pr) && (A = E.slice(1), R = !0)
    );
    const D = h && h > p ? h - p : void 0;
    return Yh(d, R, A, D);
  };
  if (c) {
    const s = c + Bh, d = r;
    r = (m) => m.startsWith(s) ? d(m.slice(s.length)) : Yh(Jb, !1, m, void 0, !0);
  }
  if (o) {
    const s = r;
    r = (d) => o({
      className: d,
      parseClassName: s
    });
  }
  return r;
}, $b = (a) => {
  const c = /* @__PURE__ */ new Map();
  return a.orderSensitiveModifiers.forEach((o, r) => {
    c.set(o, 1e6 + r);
  }), (o) => {
    const r = [];
    let s = [];
    for (let d = 0; d < o.length; d++) {
      const m = o[d], v = m[0] === "[", p = c.has(m);
      v || p ? (s.length > 0 && (s.sort(), r.push(...s), s = []), r.push(m)) : s.push(m);
    }
    return s.length > 0 && (s.sort(), r.push(...s)), r;
  };
}, Fb = (a) => ({
  cache: kb(a.cacheSize),
  parseClassName: Wb(a),
  sortModifiers: $b(a),
  ...Bb(a)
}), Ib = /\s+/, Pb = (a, c) => {
  const {
    parseClassName: o,
    getClassGroupId: r,
    getConflictingClassGroupIds: s,
    sortModifiers: d
  } = c, m = [], v = a.trim().split(Ib);
  let p = "";
  for (let h = v.length - 1; h >= 0; h -= 1) {
    const b = v[h], {
      isExternal: E,
      modifiers: A,
      hasImportantModifier: R,
      baseClassName: D,
      maybePostfixModifierPosition: S
    } = o(b);
    if (E) {
      p = b + (p.length > 0 ? " " + p : p);
      continue;
    }
    let C = !!S, j = r(C ? D.substring(0, S) : D);
    if (!j) {
      if (!C) {
        p = b + (p.length > 0 ? " " + p : p);
        continue;
      }
      if (j = r(D), !j) {
        p = b + (p.length > 0 ? " " + p : p);
        continue;
      }
      C = !1;
    }
    const O = A.length === 0 ? "" : A.length === 1 ? A[0] : d(A).join(":"), U = R ? O + Pr : O, Y = U + j;
    if (m.indexOf(Y) > -1)
      continue;
    m.push(Y);
    const k = s(j, C);
    for (let I = 0; I < k.length; ++I) {
      const J = k[I];
      m.push(U + J);
    }
    p = b + (p.length > 0 ? " " + p : p);
  }
  return p;
}, e0 = (...a) => {
  let c = 0, o, r, s = "";
  for (; c < a.length; )
    (o = a[c++]) && (r = Cv(o)) && (s && (s += " "), s += r);
  return s;
}, Cv = (a) => {
  if (typeof a == "string")
    return a;
  let c, o = "";
  for (let r = 0; r < a.length; r++)
    a[r] && (c = Cv(a[r])) && (o && (o += " "), o += c);
  return o;
}, t0 = (a, ...c) => {
  let o, r, s, d;
  const m = (p) => {
    const h = c.reduce((b, E) => E(b), a());
    return o = Fb(h), r = o.cache.get, s = o.cache.set, d = v, v(p);
  }, v = (p) => {
    const h = r(p);
    if (h)
      return h;
    const b = Pb(p, o);
    return s(p, b), b;
  };
  return d = m, (...p) => d(e0(...p));
}, n0 = [], et = (a) => {
  const c = (o) => o[a] || n0;
  return c.isThemeGetter = !0, c;
}, Ov = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, _v = /^\((?:(\w[\w-]*):)?(.+)\)$/i, l0 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, a0 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, i0 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, u0 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, c0 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, o0 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, el = (a) => l0.test(a), Ee = (a) => !!a && !Number.isNaN(Number(a)), tl = (a) => !!a && Number.isInteger(Number(a)), Gr = (a) => a.endsWith("%") && Ee(a.slice(0, -1)), wn = (a) => a0.test(a), Rv = () => !0, r0 = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  i0.test(a) && !u0.test(a)
), hs = () => !1, s0 = (a) => c0.test(a), f0 = (a) => o0.test(a), d0 = (a) => !te(a) && !ne(a), m0 = (a) => ul(a, Nv, hs), te = (a) => Ov.test(a), _l = (a) => ul(a, Dv, r0), qh = (a) => ul(a, x0, Ee), h0 = (a) => ul(a, jv, Rv), v0 = (a) => ul(a, Uv, hs), Gh = (a) => ul(a, zv, hs), g0 = (a) => ul(a, Mv, f0), Zu = (a) => ul(a, Hv, s0), ne = (a) => _v.test(a), Ei = (a) => Ul(a, Dv), p0 = (a) => Ul(a, Uv), Vh = (a) => Ul(a, zv), y0 = (a) => Ul(a, Nv), b0 = (a) => Ul(a, Mv), Ku = (a) => Ul(a, Hv, !0), S0 = (a) => Ul(a, jv, !0), ul = (a, c, o) => {
  const r = Ov.exec(a);
  return r ? r[1] ? c(r[1]) : o(r[2]) : !1;
}, Ul = (a, c, o = !1) => {
  const r = _v.exec(a);
  return r ? r[1] ? c(r[1]) : o : !1;
}, zv = (a) => a === "position" || a === "percentage", Mv = (a) => a === "image" || a === "url", Nv = (a) => a === "length" || a === "size" || a === "bg-size", Dv = (a) => a === "length", x0 = (a) => a === "number", Uv = (a) => a === "family-name", jv = (a) => a === "number" || a === "weight", Hv = (a) => a === "shadow", E0 = () => {
  const a = et("color"), c = et("font"), o = et("text"), r = et("font-weight"), s = et("tracking"), d = et("leading"), m = et("breakpoint"), v = et("container"), p = et("spacing"), h = et("radius"), b = et("shadow"), E = et("inset-shadow"), A = et("text-shadow"), R = et("drop-shadow"), D = et("blur"), S = et("perspective"), C = et("aspect"), j = et("ease"), O = et("animate"), U = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], Y = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], k = () => [...Y(), ne, te], I = () => ["auto", "hidden", "clip", "visible", "scroll"], J = () => ["auto", "contain", "none"], X = () => [ne, te, p], ue = () => [el, "full", "auto", ...X()], me = () => [tl, "none", "subgrid", ne, te], be = () => ["auto", {
    span: ["full", tl, ne, te]
  }, tl, ne, te], de = () => [tl, "auto", ne, te], ve = () => ["auto", "min", "max", "fr", ne, te], ge = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], pe = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], V = () => ["auto", ...X()], B = () => [el, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...X()], G = () => [el, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...X()], le = () => [el, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...X()], W = () => [a, ne, te], Be = () => [...Y(), Vh, Gh, {
    position: [ne, te]
  }], T = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Q = () => ["auto", "cover", "contain", y0, m0, {
    size: [ne, te]
  }], $ = () => [Gr, Ei, _l], P = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    h,
    ne,
    te
  ], ae = () => ["", Ee, Ei, _l], F = () => ["solid", "dashed", "dotted", "double"], ce = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], re = () => [Ee, Gr, Vh, Gh], se = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    D,
    ne,
    te
  ], xe = () => ["none", Ee, ne, te], Ae = () => ["none", Ee, ne, te], Qe = () => [Ee, ne, te], tt = () => [el, "full", ...X()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [wn],
      breakpoint: [wn],
      color: [Rv],
      container: [wn],
      "drop-shadow": [wn],
      ease: ["in", "out", "in-out"],
      font: [d0],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [wn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [wn],
      shadow: [wn],
      spacing: ["px", Ee],
      text: [wn],
      "text-shadow": [wn],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", el, te, ne, C]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [Ee, te, ne, v]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": U()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": U()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: k()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: I()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": I()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": I()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: J()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": J()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": J()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: ue()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": ue()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": ue()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": ue(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: ue()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": ue(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: ue()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": ue()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": ue()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: ue()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: ue()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: ue()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: ue()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [tl, "auto", ne, te]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [el, "full", "auto", v, ...X()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [Ee, el, "auto", "initial", "none", te]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", Ee, ne, te]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", Ee, ne, te]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [tl, "first", "last", "none", ne, te]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": me()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: be()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": de()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": de()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": me()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: be()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": de()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": de()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ve()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ve()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: X()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": X()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": X()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ge(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...pe(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...pe()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ge()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...pe(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...pe(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ge()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...pe(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...pe()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: X()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: X()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: X()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: X()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: X()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: X()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: X()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: X()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: X()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: X()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: X()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: V()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: V()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: V()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: V()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: V()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: V()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: V()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: V()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: V()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: V()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: V()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": X()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": X()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: B()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...G()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...G()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...G()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...le()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...le()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...le()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [v, "screen", ...B()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          v,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...B()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          v,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [m]
          },
          ...B()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...B()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...B()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...B()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", o, Ei, _l]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [r, S0, h0]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Gr, te]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [p0, v0, c]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [te]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [s, ne, te]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [Ee, "none", ne, qh]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          d,
          ...X()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", ne, te]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", ne, te]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: W()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: W()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...F(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [Ee, "from-font", "auto", ne, _l]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: W()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [Ee, "auto", ne, te]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: X()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", ne, te]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", ne, te]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Be()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: T()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Q()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, tl, ne, te],
          radial: ["", ne, te],
          conic: [tl, ne, te]
        }, b0, g0]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: W()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: $()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: $()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: $()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: W()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: W()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: W()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: P()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": P()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": P()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": P()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": P()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": P()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": P()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": P()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": P()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": P()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": P()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": P()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": P()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": P()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": P()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ae()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ae()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ae()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ae()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ae()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": ae()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": ae()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ae()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ae()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ae()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ae()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ae()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": ae()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...F(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...F(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: W()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": W()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": W()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": W()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": W()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": W()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": W()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": W()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": W()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": W()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": W()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: W()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...F(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Ee, ne, te]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", Ee, Ei, _l]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: W()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          b,
          Ku,
          Zu
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: W()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", E, Ku, Zu]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": W()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ae()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: W()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [Ee, _l]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": W()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ae()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": W()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", A, Ku, Zu]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": W()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [Ee, ne, te]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ce(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ce()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [Ee]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": re()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": re()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": W()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": W()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": re()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": re()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": W()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": W()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": re()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": re()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": W()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": W()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": re()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": re()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": W()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": W()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": re()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": re()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": W()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": W()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": re()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": re()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": W()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": W()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": re()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": re()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": W()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": W()
      }],
      "mask-image-radial": [{
        "mask-radial": [ne, te]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": re()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": re()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": W()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": W()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": Y()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [Ee]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": re()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": re()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": W()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": W()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Be()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: T()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Q()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", ne, te]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          ne,
          te
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: se()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [Ee, ne, te]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [Ee, ne, te]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          R,
          Ku,
          Zu
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": W()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", Ee, ne, te]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [Ee, ne, te]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", Ee, ne, te]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [Ee, ne, te]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", Ee, ne, te]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          ne,
          te
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": se()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [Ee, ne, te]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [Ee, ne, te]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", Ee, ne, te]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [Ee, ne, te]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", Ee, ne, te]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [Ee, ne, te]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [Ee, ne, te]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", Ee, ne, te]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": X()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": X()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": X()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", ne, te]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [Ee, "initial", ne, te]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", j, ne, te]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [Ee, ne, te]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", O, ne, te]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [S, ne, te]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": k()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: xe()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": xe()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": xe()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": xe()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Ae()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Ae()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Ae()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Ae()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Qe()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Qe()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Qe()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [ne, te, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: k()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: tt()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": tt()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": tt()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": tt()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: W()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: W()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", ne, te]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": X()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": X()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": X()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": X()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": X()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": X()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": X()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": X()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": X()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": X()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": X()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": X()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": X()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": X()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": X()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": X()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": X()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": X()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": X()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": X()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": X()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": X()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", ne, te]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...W()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Ee, Ei, _l, qh]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...W()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, A0 = /* @__PURE__ */ t0(E0);
function nn(...a) {
  return A0(Ev(a));
}
function Lv(a) {
  const [c, o] = a.split("x").map(Number);
  return { rows: c, cols: o };
}
function T0(a) {
  const { rows: c, cols: o } = Lv(a.gridLayout), r = JSON.stringify({
    rows: c,
    cols: o,
    cell_ratio: a.aspectRatio
  }), s = a.referenceImages;
  return {
    grid_setting: r,
    user_prompt: a.prompt,
    aspect_ratio: a.aspectRatio,
    reference_image_1: s[0] ?? "",
    reference_image_2: s[1] ?? "",
    reference_image_3: s[2] ?? "",
    reference_image_4: s[3] ?? ""
  };
}
const nc = {
  gridLayout: "3x3",
  aspectRatio: "16:9",
  referenceImages: [],
  prompt: ""
}, w0 = ["2x2", "3x3", "4x4"], C0 = ["16:9", "4:3", "1:1", "3:4", "9:16"], Xh = 4, O0 = {
  en: {
    title: "Multi-Panel Storyboard",
    gridLayoutLabel: "Grid Layout",
    aspectRatioLabel: "Aspect Ratio",
    referenceImagesLabel: "Reference Images",
    referenceImagesHint: "Optional, up to 4",
    promptLabel: "Story Prompt",
    promptPlaceholder: "Describe the story to break into panels...",
    generateButton: "Generate",
    generatingButton: "Generating...",
    uploadingButton: "Uploading...",
    resetButton: "Reset",
    removeImage: "Remove",
    addImage: "Add image",
    uploadFailed: "Upload failed, please retry",
    panelLabel: "Panel",
    progressLabel: "Progress"
  },
  zh: {
    title: "多宫格分镜",
    gridLayoutLabel: "宫格布局",
    aspectRatioLabel: "宫格比例",
    referenceImagesLabel: "参考图",
    referenceImagesHint: "可选,最多 4 张",
    promptLabel: "故事描述",
    promptPlaceholder: "描述要拆解成分镜的故事...",
    generateButton: "生成",
    generatingButton: "生成中...",
    uploadingButton: "上传中...",
    resetButton: "重置",
    removeImage: "删除",
    addImage: "添加图片",
    uploadFailed: "上传失败,请重试",
    panelLabel: "格",
    progressLabel: "进度"
  }
};
function Qh(a, c) {
  if (typeof a == "function")
    return a(c);
  a != null && (a.current = c);
}
function vs(...a) {
  return (c) => {
    let o = !1;
    const r = a.map((s) => {
      const d = Qh(s, c);
      return !o && typeof d == "function" && (o = !0), d;
    });
    if (o)
      return () => {
        for (let s = 0; s < r.length; s++) {
          const d = r[s];
          typeof d == "function" ? d() : Qh(a[s], null);
        }
      };
  };
}
function rt(...a) {
  return y.useCallback(vs(...a), a);
}
var _0 = Symbol.for("react.lazy"), lc = ds[" use ".trim().toString()];
function R0(a) {
  return typeof a == "object" && a !== null && "then" in a;
}
function Bv(a) {
  return a != null && typeof a == "object" && "$$typeof" in a && a.$$typeof === _0 && "_payload" in a && R0(a._payload);
}
// @__NO_SIDE_EFFECTS__
function z0(a) {
  const c = /* @__PURE__ */ N0(a), o = y.forwardRef((r, s) => {
    let { children: d, ...m } = r;
    Bv(d) && typeof lc == "function" && (d = lc(d._payload));
    const v = y.Children.toArray(d), p = v.find(U0);
    if (p) {
      const h = p.props.children, b = v.map((E) => E === p ? y.Children.count(h) > 1 ? y.Children.only(null) : y.isValidElement(h) ? h.props.children : null : E);
      return /* @__PURE__ */ L.jsx(c, { ...m, ref: s, children: y.isValidElement(h) ? y.cloneElement(h, void 0, b) : null });
    }
    return /* @__PURE__ */ L.jsx(c, { ...m, ref: s, children: d });
  });
  return o.displayName = `${a}.Slot`, o;
}
var M0 = /* @__PURE__ */ z0("Slot");
// @__NO_SIDE_EFFECTS__
function N0(a) {
  const c = y.forwardRef((o, r) => {
    let { children: s, ...d } = o;
    if (Bv(s) && typeof lc == "function" && (s = lc(s._payload)), y.isValidElement(s)) {
      const m = H0(s), v = j0(d, s.props);
      return s.type !== y.Fragment && (v.ref = r ? vs(r, m) : m), y.cloneElement(s, v);
    }
    return y.Children.count(s) > 1 ? y.Children.only(null) : null;
  });
  return c.displayName = `${a}.SlotClone`, c;
}
var D0 = Symbol("radix.slottable");
function U0(a) {
  return y.isValidElement(a) && typeof a.type == "function" && "__radixId" in a.type && a.type.__radixId === D0;
}
function j0(a, c) {
  const o = { ...c };
  for (const r in c) {
    const s = a[r], d = c[r];
    /^on[A-Z]/.test(r) ? s && d ? o[r] = (...v) => {
      const p = d(...v);
      return s(...v), p;
    } : s && (o[r] = s) : r === "style" ? o[r] = { ...s, ...d } : r === "className" && (o[r] = [s, d].filter(Boolean).join(" "));
  }
  return { ...a, ...o };
}
function H0(a) {
  var r, s;
  let c = (r = Object.getOwnPropertyDescriptor(a.props, "ref")) == null ? void 0 : r.get, o = c && "isReactWarning" in c && c.isReactWarning;
  return o ? a.ref : (c = (s = Object.getOwnPropertyDescriptor(a, "ref")) == null ? void 0 : s.get, o = c && "isReactWarning" in c && c.isReactWarning, o ? a.props.ref : a.props.ref || a.ref);
}
const Zh = (a) => typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a, Kh = Ev, L0 = (a, c) => (o) => {
  var r;
  if ((c == null ? void 0 : c.variants) == null) return Kh(a, o == null ? void 0 : o.class, o == null ? void 0 : o.className);
  const { variants: s, defaultVariants: d } = c, m = Object.keys(s).map((h) => {
    const b = o == null ? void 0 : o[h], E = d == null ? void 0 : d[h];
    if (b === null) return null;
    const A = Zh(b) || Zh(E);
    return s[h][A];
  }), v = o && Object.entries(o).reduce((h, b) => {
    let [E, A] = b;
    return A === void 0 || (h[E] = A), h;
  }, {}), p = c == null || (r = c.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((h, b) => {
    let { class: E, className: A, ...R } = b;
    return Object.entries(R).every((D) => {
      let [S, C] = D;
      return Array.isArray(C) ? C.includes({
        ...d,
        ...v
      }[S]) : {
        ...d,
        ...v
      }[S] === C;
    }) ? [
      ...h,
      E,
      A
    ] : h;
  }, []);
  return Kh(a, m, p, o == null ? void 0 : o.class, o == null ? void 0 : o.className);
}, B0 = L0(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-none text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/15",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 px-2.5 py-1 [&_svg]:size-4",
        sm: "h-7 px-2 py-1 [&_svg]:size-3.5",
        xs: "h-6 px-2 py-1 [&_svg]:size-3.5",
        lg: "h-9 px-3 py-1.5 [&_svg]:size-4",
        icon: "h-8 w-8 [&_svg]:size-4",
        "icon-sm": "h-7 w-7 [&_svg]:size-3.5",
        "icon-xs": "h-6 w-6 [&_svg]:size-3.5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), es = y.forwardRef(
  ({ className: a, variant: c, size: o, asChild: r = !1, ...s }, d) => {
    const m = r ? M0 : "button";
    return /* @__PURE__ */ L.jsx(m, { className: nn(B0({ variant: c, size: o, className: a })), ref: d, ...s });
  }
);
es.displayName = "Button";
const Yv = y.forwardRef(
  ({ className: a, ...c }, o) => /* @__PURE__ */ L.jsx(
    "textarea",
    {
      ref: o,
      className: nn(
        "flex min-h-16 w-full rounded-none border border-input bg-background px-2.5 py-1.5 text-xs shadow-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        a
      ),
      ...c
    }
  )
);
Yv.displayName = "Textarea";
var wi = Sv();
const Y0 = /* @__PURE__ */ bv(wi);
function kh(a, [c, o]) {
  return Math.min(o, Math.max(c, a));
}
function Ie(a, c, { checkForDefaultPrevented: o = !0 } = {}) {
  return function(s) {
    if (a == null || a(s), o === !1 || !s.defaultPrevented)
      return c == null ? void 0 : c(s);
  };
}
function gs(a, c = []) {
  let o = [];
  function r(d, m) {
    const v = y.createContext(m), p = o.length;
    o = [...o, m];
    const h = (E) => {
      var j;
      const { scope: A, children: R, ...D } = E, S = ((j = A == null ? void 0 : A[a]) == null ? void 0 : j[p]) || v, C = y.useMemo(() => D, Object.values(D));
      return /* @__PURE__ */ L.jsx(S.Provider, { value: C, children: R });
    };
    h.displayName = d + "Provider";
    function b(E, A) {
      var S;
      const R = ((S = A == null ? void 0 : A[a]) == null ? void 0 : S[p]) || v, D = y.useContext(R);
      if (D) return D;
      if (m !== void 0) return m;
      throw new Error(`\`${E}\` must be used within \`${d}\``);
    }
    return [h, b];
  }
  const s = () => {
    const d = o.map((m) => y.createContext(m));
    return function(v) {
      const p = (v == null ? void 0 : v[a]) || d;
      return y.useMemo(
        () => ({ [`__scope${a}`]: { ...v, [a]: p } }),
        [v, p]
      );
    };
  };
  return s.scopeName = a, [r, q0(s, ...c)];
}
function q0(...a) {
  const c = a[0];
  if (a.length === 1) return c;
  const o = () => {
    const r = a.map((s) => ({
      useScope: s(),
      scopeName: s.scopeName
    }));
    return function(d) {
      const m = r.reduce((v, { useScope: p, scopeName: h }) => {
        const E = p(d)[`__scope${h}`];
        return { ...v, ...E };
      }, {});
      return y.useMemo(() => ({ [`__scope${c.scopeName}`]: m }), [m]);
    };
  };
  return o.scopeName = c.scopeName, o;
}
// @__NO_SIDE_EFFECTS__
function ac(a) {
  const c = /* @__PURE__ */ G0(a), o = y.forwardRef((r, s) => {
    const { children: d, ...m } = r, v = y.Children.toArray(d), p = v.find(X0);
    if (p) {
      const h = p.props.children, b = v.map((E) => E === p ? y.Children.count(h) > 1 ? y.Children.only(null) : y.isValidElement(h) ? h.props.children : null : E);
      return /* @__PURE__ */ L.jsx(c, { ...m, ref: s, children: y.isValidElement(h) ? y.cloneElement(h, void 0, b) : null });
    }
    return /* @__PURE__ */ L.jsx(c, { ...m, ref: s, children: d });
  });
  return o.displayName = `${a}.Slot`, o;
}
// @__NO_SIDE_EFFECTS__
function G0(a) {
  const c = y.forwardRef((o, r) => {
    const { children: s, ...d } = o;
    if (y.isValidElement(s)) {
      const m = Z0(s), v = Q0(d, s.props);
      return s.type !== y.Fragment && (v.ref = r ? vs(r, m) : m), y.cloneElement(s, v);
    }
    return y.Children.count(s) > 1 ? y.Children.only(null) : null;
  });
  return c.displayName = `${a}.SlotClone`, c;
}
var V0 = Symbol("radix.slottable");
function X0(a) {
  return y.isValidElement(a) && typeof a.type == "function" && "__radixId" in a.type && a.type.__radixId === V0;
}
function Q0(a, c) {
  const o = { ...c };
  for (const r in c) {
    const s = a[r], d = c[r];
    /^on[A-Z]/.test(r) ? s && d ? o[r] = (...v) => {
      const p = d(...v);
      return s(...v), p;
    } : s && (o[r] = s) : r === "style" ? o[r] = { ...s, ...d } : r === "className" && (o[r] = [s, d].filter(Boolean).join(" "));
  }
  return { ...a, ...o };
}
function Z0(a) {
  var r, s;
  let c = (r = Object.getOwnPropertyDescriptor(a.props, "ref")) == null ? void 0 : r.get, o = c && "isReactWarning" in c && c.isReactWarning;
  return o ? a.ref : (c = (s = Object.getOwnPropertyDescriptor(a, "ref")) == null ? void 0 : s.get, o = c && "isReactWarning" in c && c.isReactWarning, o ? a.props.ref : a.props.ref || a.ref);
}
function K0(a) {
  const c = a + "CollectionProvider", [o, r] = gs(c), [s, d] = o(
    c,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), m = (S) => {
    const { scope: C, children: j } = S, O = nl.useRef(null), U = nl.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ L.jsx(s, { scope: C, itemMap: U, collectionRef: O, children: j });
  };
  m.displayName = c;
  const v = a + "CollectionSlot", p = /* @__PURE__ */ ac(v), h = nl.forwardRef(
    (S, C) => {
      const { scope: j, children: O } = S, U = d(v, j), Y = rt(C, U.collectionRef);
      return /* @__PURE__ */ L.jsx(p, { ref: Y, children: O });
    }
  );
  h.displayName = v;
  const b = a + "CollectionItemSlot", E = "data-radix-collection-item", A = /* @__PURE__ */ ac(b), R = nl.forwardRef(
    (S, C) => {
      const { scope: j, children: O, ...U } = S, Y = nl.useRef(null), k = rt(C, Y), I = d(b, j);
      return nl.useEffect(() => (I.itemMap.set(Y, { ref: Y, ...U }), () => void I.itemMap.delete(Y))), /* @__PURE__ */ L.jsx(A, { [E]: "", ref: k, children: O });
    }
  );
  R.displayName = b;
  function D(S) {
    const C = d(a + "CollectionConsumer", S);
    return nl.useCallback(() => {
      const O = C.collectionRef.current;
      if (!O) return [];
      const U = Array.from(O.querySelectorAll(`[${E}]`));
      return Array.from(C.itemMap.values()).sort(
        (I, J) => U.indexOf(I.ref.current) - U.indexOf(J.ref.current)
      );
    }, [C.collectionRef, C.itemMap]);
  }
  return [
    { Provider: m, Slot: h, ItemSlot: R },
    D,
    r
  ];
}
var k0 = y.createContext(void 0);
function J0(a) {
  const c = y.useContext(k0);
  return a || c || "ltr";
}
var W0 = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], ke = W0.reduce((a, c) => {
  const o = /* @__PURE__ */ ac(`Primitive.${c}`), r = y.forwardRef((s, d) => {
    const { asChild: m, ...v } = s, p = m ? o : c;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ L.jsx(p, { ...v, ref: d });
  });
  return r.displayName = `Primitive.${c}`, { ...a, [c]: r };
}, {});
function $0(a, c) {
  a && wi.flushSync(() => a.dispatchEvent(c));
}
function zl(a) {
  const c = y.useRef(a);
  return y.useEffect(() => {
    c.current = a;
  }), y.useMemo(() => (...o) => {
    var r;
    return (r = c.current) == null ? void 0 : r.call(c, ...o);
  }, []);
}
function F0(a, c = globalThis == null ? void 0 : globalThis.document) {
  const o = zl(a);
  y.useEffect(() => {
    const r = (s) => {
      s.key === "Escape" && o(s);
    };
    return c.addEventListener("keydown", r, { capture: !0 }), () => c.removeEventListener("keydown", r, { capture: !0 });
  }, [o, c]);
}
var I0 = "DismissableLayer", ts = "dismissableLayer.update", P0 = "dismissableLayer.pointerDownOutside", eS = "dismissableLayer.focusOutside", Jh, qv = y.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Gv = y.forwardRef(
  (a, c) => {
    const {
      disableOutsidePointerEvents: o = !1,
      onEscapeKeyDown: r,
      onPointerDownOutside: s,
      onFocusOutside: d,
      onInteractOutside: m,
      onDismiss: v,
      ...p
    } = a, h = y.useContext(qv), [b, E] = y.useState(null), A = (b == null ? void 0 : b.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, R] = y.useState({}), D = rt(c, (J) => E(J)), S = Array.from(h.layers), [C] = [...h.layersWithOutsidePointerEventsDisabled].slice(-1), j = S.indexOf(C), O = b ? S.indexOf(b) : -1, U = h.layersWithOutsidePointerEventsDisabled.size > 0, Y = O >= j, k = lS((J) => {
      const X = J.target, ue = [...h.branches].some((me) => me.contains(X));
      !Y || ue || (s == null || s(J), m == null || m(J), J.defaultPrevented || v == null || v());
    }, A), I = aS((J) => {
      const X = J.target;
      [...h.branches].some((me) => me.contains(X)) || (d == null || d(J), m == null || m(J), J.defaultPrevented || v == null || v());
    }, A);
    return F0((J) => {
      O === h.layers.size - 1 && (r == null || r(J), !J.defaultPrevented && v && (J.preventDefault(), v()));
    }, A), y.useEffect(() => {
      if (b)
        return o && (h.layersWithOutsidePointerEventsDisabled.size === 0 && (Jh = A.body.style.pointerEvents, A.body.style.pointerEvents = "none"), h.layersWithOutsidePointerEventsDisabled.add(b)), h.layers.add(b), Wh(), () => {
          o && h.layersWithOutsidePointerEventsDisabled.size === 1 && (A.body.style.pointerEvents = Jh);
        };
    }, [b, A, o, h]), y.useEffect(() => () => {
      b && (h.layers.delete(b), h.layersWithOutsidePointerEventsDisabled.delete(b), Wh());
    }, [b, h]), y.useEffect(() => {
      const J = () => R({});
      return document.addEventListener(ts, J), () => document.removeEventListener(ts, J);
    }, []), /* @__PURE__ */ L.jsx(
      ke.div,
      {
        ...p,
        ref: D,
        style: {
          pointerEvents: U ? Y ? "auto" : "none" : void 0,
          ...a.style
        },
        onFocusCapture: Ie(a.onFocusCapture, I.onFocusCapture),
        onBlurCapture: Ie(a.onBlurCapture, I.onBlurCapture),
        onPointerDownCapture: Ie(
          a.onPointerDownCapture,
          k.onPointerDownCapture
        )
      }
    );
  }
);
Gv.displayName = I0;
var tS = "DismissableLayerBranch", nS = y.forwardRef((a, c) => {
  const o = y.useContext(qv), r = y.useRef(null), s = rt(c, r);
  return y.useEffect(() => {
    const d = r.current;
    if (d)
      return o.branches.add(d), () => {
        o.branches.delete(d);
      };
  }, [o.branches]), /* @__PURE__ */ L.jsx(ke.div, { ...a, ref: s });
});
nS.displayName = tS;
function lS(a, c = globalThis == null ? void 0 : globalThis.document) {
  const o = zl(a), r = y.useRef(!1), s = y.useRef(() => {
  });
  return y.useEffect(() => {
    const d = (v) => {
      if (v.target && !r.current) {
        let p = function() {
          Vv(
            P0,
            o,
            h,
            { discrete: !0 }
          );
        };
        const h = { originalEvent: v };
        v.pointerType === "touch" ? (c.removeEventListener("click", s.current), s.current = p, c.addEventListener("click", s.current, { once: !0 })) : p();
      } else
        c.removeEventListener("click", s.current);
      r.current = !1;
    }, m = window.setTimeout(() => {
      c.addEventListener("pointerdown", d);
    }, 0);
    return () => {
      window.clearTimeout(m), c.removeEventListener("pointerdown", d), c.removeEventListener("click", s.current);
    };
  }, [c, o]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => r.current = !0
  };
}
function aS(a, c = globalThis == null ? void 0 : globalThis.document) {
  const o = zl(a), r = y.useRef(!1);
  return y.useEffect(() => {
    const s = (d) => {
      d.target && !r.current && Vv(eS, o, { originalEvent: d }, {
        discrete: !1
      });
    };
    return c.addEventListener("focusin", s), () => c.removeEventListener("focusin", s);
  }, [c, o]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function Wh() {
  const a = new CustomEvent(ts);
  document.dispatchEvent(a);
}
function Vv(a, c, o, { discrete: r }) {
  const s = o.originalEvent.target, d = new CustomEvent(a, { bubbles: !1, cancelable: !0, detail: o });
  c && s.addEventListener(a, c, { once: !0 }), r ? $0(s, d) : s.dispatchEvent(d);
}
var Vr = 0;
function iS() {
  y.useEffect(() => {
    const a = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", a[0] ?? $h()), document.body.insertAdjacentElement("beforeend", a[1] ?? $h()), Vr++, () => {
      Vr === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((c) => c.remove()), Vr--;
    };
  }, []);
}
function $h() {
  const a = document.createElement("span");
  return a.setAttribute("data-radix-focus-guard", ""), a.tabIndex = 0, a.style.outline = "none", a.style.opacity = "0", a.style.position = "fixed", a.style.pointerEvents = "none", a;
}
var Xr = "focusScope.autoFocusOnMount", Qr = "focusScope.autoFocusOnUnmount", Fh = { bubbles: !1, cancelable: !0 }, uS = "FocusScope", Xv = y.forwardRef((a, c) => {
  const {
    loop: o = !1,
    trapped: r = !1,
    onMountAutoFocus: s,
    onUnmountAutoFocus: d,
    ...m
  } = a, [v, p] = y.useState(null), h = zl(s), b = zl(d), E = y.useRef(null), A = rt(c, (S) => p(S)), R = y.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  y.useEffect(() => {
    if (r) {
      let S = function(U) {
        if (R.paused || !v) return;
        const Y = U.target;
        v.contains(Y) ? E.current = Y : ll(E.current, { select: !0 });
      }, C = function(U) {
        if (R.paused || !v) return;
        const Y = U.relatedTarget;
        Y !== null && (v.contains(Y) || ll(E.current, { select: !0 }));
      }, j = function(U) {
        if (document.activeElement === document.body)
          for (const k of U)
            k.removedNodes.length > 0 && ll(v);
      };
      document.addEventListener("focusin", S), document.addEventListener("focusout", C);
      const O = new MutationObserver(j);
      return v && O.observe(v, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", S), document.removeEventListener("focusout", C), O.disconnect();
      };
    }
  }, [r, v, R.paused]), y.useEffect(() => {
    if (v) {
      Ph.add(R);
      const S = document.activeElement;
      if (!v.contains(S)) {
        const j = new CustomEvent(Xr, Fh);
        v.addEventListener(Xr, h), v.dispatchEvent(j), j.defaultPrevented || (cS(dS(Qv(v)), { select: !0 }), document.activeElement === S && ll(v));
      }
      return () => {
        v.removeEventListener(Xr, h), setTimeout(() => {
          const j = new CustomEvent(Qr, Fh);
          v.addEventListener(Qr, b), v.dispatchEvent(j), j.defaultPrevented || ll(S ?? document.body, { select: !0 }), v.removeEventListener(Qr, b), Ph.remove(R);
        }, 0);
      };
    }
  }, [v, h, b, R]);
  const D = y.useCallback(
    (S) => {
      if (!o && !r || R.paused) return;
      const C = S.key === "Tab" && !S.altKey && !S.ctrlKey && !S.metaKey, j = document.activeElement;
      if (C && j) {
        const O = S.currentTarget, [U, Y] = oS(O);
        U && Y ? !S.shiftKey && j === Y ? (S.preventDefault(), o && ll(U, { select: !0 })) : S.shiftKey && j === U && (S.preventDefault(), o && ll(Y, { select: !0 })) : j === O && S.preventDefault();
      }
    },
    [o, r, R.paused]
  );
  return /* @__PURE__ */ L.jsx(ke.div, { tabIndex: -1, ...m, ref: A, onKeyDown: D });
});
Xv.displayName = uS;
function cS(a, { select: c = !1 } = {}) {
  const o = document.activeElement;
  for (const r of a)
    if (ll(r, { select: c }), document.activeElement !== o) return;
}
function oS(a) {
  const c = Qv(a), o = Ih(c, a), r = Ih(c.reverse(), a);
  return [o, r];
}
function Qv(a) {
  const c = [], o = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const s = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || s ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; o.nextNode(); ) c.push(o.currentNode);
  return c;
}
function Ih(a, c) {
  for (const o of a)
    if (!rS(o, { upTo: c })) return o;
}
function rS(a, { upTo: c }) {
  if (getComputedStyle(a).visibility === "hidden") return !0;
  for (; a; ) {
    if (c !== void 0 && a === c) return !1;
    if (getComputedStyle(a).display === "none") return !0;
    a = a.parentElement;
  }
  return !1;
}
function sS(a) {
  return a instanceof HTMLInputElement && "select" in a;
}
function ll(a, { select: c = !1 } = {}) {
  if (a && a.focus) {
    const o = document.activeElement;
    a.focus({ preventScroll: !0 }), a !== o && sS(a) && c && a.select();
  }
}
var Ph = fS();
function fS() {
  let a = [];
  return {
    add(c) {
      const o = a[0];
      c !== o && (o == null || o.pause()), a = ev(a, c), a.unshift(c);
    },
    remove(c) {
      var o;
      a = ev(a, c), (o = a[0]) == null || o.resume();
    }
  };
}
function ev(a, c) {
  const o = [...a], r = o.indexOf(c);
  return r !== -1 && o.splice(r, 1), o;
}
function dS(a) {
  return a.filter((c) => c.tagName !== "A");
}
var bt = globalThis != null && globalThis.document ? y.useLayoutEffect : () => {
}, mS = ds[" useId ".trim().toString()] || (() => {
}), hS = 0;
function ps(a) {
  const [c, o] = y.useState(mS());
  return bt(() => {
    o((r) => r ?? String(hS++));
  }, [a]), c ? `radix-${c}` : "";
}
const vS = ["top", "right", "bottom", "left"], al = Math.min, Mt = Math.max, ic = Math.round, ku = Math.floor, tn = (a) => ({
  x: a,
  y: a
}), gS = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function ns(a, c, o) {
  return Mt(a, al(c, o));
}
function Cn(a, c) {
  return typeof a == "function" ? a(c) : a;
}
function On(a) {
  return a.split("-")[0];
}
function wa(a) {
  return a.split("-")[1];
}
function ys(a) {
  return a === "x" ? "y" : "x";
}
function bs(a) {
  return a === "y" ? "height" : "width";
}
function en(a) {
  const c = a[0];
  return c === "t" || c === "b" ? "y" : "x";
}
function Ss(a) {
  return ys(en(a));
}
function pS(a, c, o) {
  o === void 0 && (o = !1);
  const r = wa(a), s = Ss(a), d = bs(s);
  let m = s === "x" ? r === (o ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return c.reference[d] > c.floating[d] && (m = uc(m)), [m, uc(m)];
}
function yS(a) {
  const c = uc(a);
  return [ls(a), c, ls(c)];
}
function ls(a) {
  return a.includes("start") ? a.replace("start", "end") : a.replace("end", "start");
}
const tv = ["left", "right"], nv = ["right", "left"], bS = ["top", "bottom"], SS = ["bottom", "top"];
function xS(a, c, o) {
  switch (a) {
    case "top":
    case "bottom":
      return o ? c ? nv : tv : c ? tv : nv;
    case "left":
    case "right":
      return c ? bS : SS;
    default:
      return [];
  }
}
function ES(a, c, o, r) {
  const s = wa(a);
  let d = xS(On(a), o === "start", r);
  return s && (d = d.map((m) => m + "-" + s), c && (d = d.concat(d.map(ls)))), d;
}
function uc(a) {
  const c = On(a);
  return gS[c] + a.slice(c.length);
}
function AS(a) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...a
  };
}
function Zv(a) {
  return typeof a != "number" ? AS(a) : {
    top: a,
    right: a,
    bottom: a,
    left: a
  };
}
function cc(a) {
  const {
    x: c,
    y: o,
    width: r,
    height: s
  } = a;
  return {
    width: r,
    height: s,
    top: o,
    left: c,
    right: c + r,
    bottom: o + s,
    x: c,
    y: o
  };
}
function lv(a, c, o) {
  let {
    reference: r,
    floating: s
  } = a;
  const d = en(c), m = Ss(c), v = bs(m), p = On(c), h = d === "y", b = r.x + r.width / 2 - s.width / 2, E = r.y + r.height / 2 - s.height / 2, A = r[v] / 2 - s[v] / 2;
  let R;
  switch (p) {
    case "top":
      R = {
        x: b,
        y: r.y - s.height
      };
      break;
    case "bottom":
      R = {
        x: b,
        y: r.y + r.height
      };
      break;
    case "right":
      R = {
        x: r.x + r.width,
        y: E
      };
      break;
    case "left":
      R = {
        x: r.x - s.width,
        y: E
      };
      break;
    default:
      R = {
        x: r.x,
        y: r.y
      };
  }
  switch (wa(c)) {
    case "start":
      R[m] -= A * (o && h ? -1 : 1);
      break;
    case "end":
      R[m] += A * (o && h ? -1 : 1);
      break;
  }
  return R;
}
async function TS(a, c) {
  var o;
  c === void 0 && (c = {});
  const {
    x: r,
    y: s,
    platform: d,
    rects: m,
    elements: v,
    strategy: p
  } = a, {
    boundary: h = "clippingAncestors",
    rootBoundary: b = "viewport",
    elementContext: E = "floating",
    altBoundary: A = !1,
    padding: R = 0
  } = Cn(c, a), D = Zv(R), C = v[A ? E === "floating" ? "reference" : "floating" : E], j = cc(await d.getClippingRect({
    element: (o = await (d.isElement == null ? void 0 : d.isElement(C))) == null || o ? C : C.contextElement || await (d.getDocumentElement == null ? void 0 : d.getDocumentElement(v.floating)),
    boundary: h,
    rootBoundary: b,
    strategy: p
  })), O = E === "floating" ? {
    x: r,
    y: s,
    width: m.floating.width,
    height: m.floating.height
  } : m.reference, U = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(v.floating)), Y = await (d.isElement == null ? void 0 : d.isElement(U)) ? await (d.getScale == null ? void 0 : d.getScale(U)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, k = cc(d.convertOffsetParentRelativeRectToViewportRelativeRect ? await d.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: v,
    rect: O,
    offsetParent: U,
    strategy: p
  }) : O);
  return {
    top: (j.top - k.top + D.top) / Y.y,
    bottom: (k.bottom - j.bottom + D.bottom) / Y.y,
    left: (j.left - k.left + D.left) / Y.x,
    right: (k.right - j.right + D.right) / Y.x
  };
}
const wS = 50, CS = async (a, c, o) => {
  const {
    placement: r = "bottom",
    strategy: s = "absolute",
    middleware: d = [],
    platform: m
  } = o, v = m.detectOverflow ? m : {
    ...m,
    detectOverflow: TS
  }, p = await (m.isRTL == null ? void 0 : m.isRTL(c));
  let h = await m.getElementRects({
    reference: a,
    floating: c,
    strategy: s
  }), {
    x: b,
    y: E
  } = lv(h, r, p), A = r, R = 0;
  const D = {};
  for (let S = 0; S < d.length; S++) {
    const C = d[S];
    if (!C)
      continue;
    const {
      name: j,
      fn: O
    } = C, {
      x: U,
      y: Y,
      data: k,
      reset: I
    } = await O({
      x: b,
      y: E,
      initialPlacement: r,
      placement: A,
      strategy: s,
      middlewareData: D,
      rects: h,
      platform: v,
      elements: {
        reference: a,
        floating: c
      }
    });
    b = U ?? b, E = Y ?? E, D[j] = {
      ...D[j],
      ...k
    }, I && R < wS && (R++, typeof I == "object" && (I.placement && (A = I.placement), I.rects && (h = I.rects === !0 ? await m.getElementRects({
      reference: a,
      floating: c,
      strategy: s
    }) : I.rects), {
      x: b,
      y: E
    } = lv(h, A, p)), S = -1);
  }
  return {
    x: b,
    y: E,
    placement: A,
    strategy: s,
    middlewareData: D
  };
}, OS = (a) => ({
  name: "arrow",
  options: a,
  async fn(c) {
    const {
      x: o,
      y: r,
      placement: s,
      rects: d,
      platform: m,
      elements: v,
      middlewareData: p
    } = c, {
      element: h,
      padding: b = 0
    } = Cn(a, c) || {};
    if (h == null)
      return {};
    const E = Zv(b), A = {
      x: o,
      y: r
    }, R = Ss(s), D = bs(R), S = await m.getDimensions(h), C = R === "y", j = C ? "top" : "left", O = C ? "bottom" : "right", U = C ? "clientHeight" : "clientWidth", Y = d.reference[D] + d.reference[R] - A[R] - d.floating[D], k = A[R] - d.reference[R], I = await (m.getOffsetParent == null ? void 0 : m.getOffsetParent(h));
    let J = I ? I[U] : 0;
    (!J || !await (m.isElement == null ? void 0 : m.isElement(I))) && (J = v.floating[U] || d.floating[D]);
    const X = Y / 2 - k / 2, ue = J / 2 - S[D] / 2 - 1, me = al(E[j], ue), be = al(E[O], ue), de = me, ve = J - S[D] - be, ge = J / 2 - S[D] / 2 + X, pe = ns(de, ge, ve), V = !p.arrow && wa(s) != null && ge !== pe && d.reference[D] / 2 - (ge < de ? me : be) - S[D] / 2 < 0, B = V ? ge < de ? ge - de : ge - ve : 0;
    return {
      [R]: A[R] + B,
      data: {
        [R]: pe,
        centerOffset: ge - pe - B,
        ...V && {
          alignmentOffset: B
        }
      },
      reset: V
    };
  }
}), _S = function(a) {
  return a === void 0 && (a = {}), {
    name: "flip",
    options: a,
    async fn(c) {
      var o, r;
      const {
        placement: s,
        middlewareData: d,
        rects: m,
        initialPlacement: v,
        platform: p,
        elements: h
      } = c, {
        mainAxis: b = !0,
        crossAxis: E = !0,
        fallbackPlacements: A,
        fallbackStrategy: R = "bestFit",
        fallbackAxisSideDirection: D = "none",
        flipAlignment: S = !0,
        ...C
      } = Cn(a, c);
      if ((o = d.arrow) != null && o.alignmentOffset)
        return {};
      const j = On(s), O = en(v), U = On(v) === v, Y = await (p.isRTL == null ? void 0 : p.isRTL(h.floating)), k = A || (U || !S ? [uc(v)] : yS(v)), I = D !== "none";
      !A && I && k.push(...ES(v, S, D, Y));
      const J = [v, ...k], X = await p.detectOverflow(c, C), ue = [];
      let me = ((r = d.flip) == null ? void 0 : r.overflows) || [];
      if (b && ue.push(X[j]), E) {
        const ge = pS(s, m, Y);
        ue.push(X[ge[0]], X[ge[1]]);
      }
      if (me = [...me, {
        placement: s,
        overflows: ue
      }], !ue.every((ge) => ge <= 0)) {
        var be, de;
        const ge = (((be = d.flip) == null ? void 0 : be.index) || 0) + 1, pe = J[ge];
        if (pe && (!(E === "alignment" ? O !== en(pe) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        me.every((G) => en(G.placement) === O ? G.overflows[0] > 0 : !0)))
          return {
            data: {
              index: ge,
              overflows: me
            },
            reset: {
              placement: pe
            }
          };
        let V = (de = me.filter((B) => B.overflows[0] <= 0).sort((B, G) => B.overflows[1] - G.overflows[1])[0]) == null ? void 0 : de.placement;
        if (!V)
          switch (R) {
            case "bestFit": {
              var ve;
              const B = (ve = me.filter((G) => {
                if (I) {
                  const le = en(G.placement);
                  return le === O || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  le === "y";
                }
                return !0;
              }).map((G) => [G.placement, G.overflows.filter((le) => le > 0).reduce((le, W) => le + W, 0)]).sort((G, le) => G[1] - le[1])[0]) == null ? void 0 : ve[0];
              B && (V = B);
              break;
            }
            case "initialPlacement":
              V = v;
              break;
          }
        if (s !== V)
          return {
            reset: {
              placement: V
            }
          };
      }
      return {};
    }
  };
};
function av(a, c) {
  return {
    top: a.top - c.height,
    right: a.right - c.width,
    bottom: a.bottom - c.height,
    left: a.left - c.width
  };
}
function iv(a) {
  return vS.some((c) => a[c] >= 0);
}
const RS = function(a) {
  return a === void 0 && (a = {}), {
    name: "hide",
    options: a,
    async fn(c) {
      const {
        rects: o,
        platform: r
      } = c, {
        strategy: s = "referenceHidden",
        ...d
      } = Cn(a, c);
      switch (s) {
        case "referenceHidden": {
          const m = await r.detectOverflow(c, {
            ...d,
            elementContext: "reference"
          }), v = av(m, o.reference);
          return {
            data: {
              referenceHiddenOffsets: v,
              referenceHidden: iv(v)
            }
          };
        }
        case "escaped": {
          const m = await r.detectOverflow(c, {
            ...d,
            altBoundary: !0
          }), v = av(m, o.floating);
          return {
            data: {
              escapedOffsets: v,
              escaped: iv(v)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Kv = /* @__PURE__ */ new Set(["left", "top"]);
async function zS(a, c) {
  const {
    placement: o,
    platform: r,
    elements: s
  } = a, d = await (r.isRTL == null ? void 0 : r.isRTL(s.floating)), m = On(o), v = wa(o), p = en(o) === "y", h = Kv.has(m) ? -1 : 1, b = d && p ? -1 : 1, E = Cn(c, a);
  let {
    mainAxis: A,
    crossAxis: R,
    alignmentAxis: D
  } = typeof E == "number" ? {
    mainAxis: E,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: E.mainAxis || 0,
    crossAxis: E.crossAxis || 0,
    alignmentAxis: E.alignmentAxis
  };
  return v && typeof D == "number" && (R = v === "end" ? D * -1 : D), p ? {
    x: R * b,
    y: A * h
  } : {
    x: A * h,
    y: R * b
  };
}
const MS = function(a) {
  return a === void 0 && (a = 0), {
    name: "offset",
    options: a,
    async fn(c) {
      var o, r;
      const {
        x: s,
        y: d,
        placement: m,
        middlewareData: v
      } = c, p = await zS(c, a);
      return m === ((o = v.offset) == null ? void 0 : o.placement) && (r = v.arrow) != null && r.alignmentOffset ? {} : {
        x: s + p.x,
        y: d + p.y,
        data: {
          ...p,
          placement: m
        }
      };
    }
  };
}, NS = function(a) {
  return a === void 0 && (a = {}), {
    name: "shift",
    options: a,
    async fn(c) {
      const {
        x: o,
        y: r,
        placement: s,
        platform: d
      } = c, {
        mainAxis: m = !0,
        crossAxis: v = !1,
        limiter: p = {
          fn: (j) => {
            let {
              x: O,
              y: U
            } = j;
            return {
              x: O,
              y: U
            };
          }
        },
        ...h
      } = Cn(a, c), b = {
        x: o,
        y: r
      }, E = await d.detectOverflow(c, h), A = en(On(s)), R = ys(A);
      let D = b[R], S = b[A];
      if (m) {
        const j = R === "y" ? "top" : "left", O = R === "y" ? "bottom" : "right", U = D + E[j], Y = D - E[O];
        D = ns(U, D, Y);
      }
      if (v) {
        const j = A === "y" ? "top" : "left", O = A === "y" ? "bottom" : "right", U = S + E[j], Y = S - E[O];
        S = ns(U, S, Y);
      }
      const C = p.fn({
        ...c,
        [R]: D,
        [A]: S
      });
      return {
        ...C,
        data: {
          x: C.x - o,
          y: C.y - r,
          enabled: {
            [R]: m,
            [A]: v
          }
        }
      };
    }
  };
}, DS = function(a) {
  return a === void 0 && (a = {}), {
    options: a,
    fn(c) {
      const {
        x: o,
        y: r,
        placement: s,
        rects: d,
        middlewareData: m
      } = c, {
        offset: v = 0,
        mainAxis: p = !0,
        crossAxis: h = !0
      } = Cn(a, c), b = {
        x: o,
        y: r
      }, E = en(s), A = ys(E);
      let R = b[A], D = b[E];
      const S = Cn(v, c), C = typeof S == "number" ? {
        mainAxis: S,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...S
      };
      if (p) {
        const U = A === "y" ? "height" : "width", Y = d.reference[A] - d.floating[U] + C.mainAxis, k = d.reference[A] + d.reference[U] - C.mainAxis;
        R < Y ? R = Y : R > k && (R = k);
      }
      if (h) {
        var j, O;
        const U = A === "y" ? "width" : "height", Y = Kv.has(On(s)), k = d.reference[E] - d.floating[U] + (Y && ((j = m.offset) == null ? void 0 : j[E]) || 0) + (Y ? 0 : C.crossAxis), I = d.reference[E] + d.reference[U] + (Y ? 0 : ((O = m.offset) == null ? void 0 : O[E]) || 0) - (Y ? C.crossAxis : 0);
        D < k ? D = k : D > I && (D = I);
      }
      return {
        [A]: R,
        [E]: D
      };
    }
  };
}, US = function(a) {
  return a === void 0 && (a = {}), {
    name: "size",
    options: a,
    async fn(c) {
      var o, r;
      const {
        placement: s,
        rects: d,
        platform: m,
        elements: v
      } = c, {
        apply: p = () => {
        },
        ...h
      } = Cn(a, c), b = await m.detectOverflow(c, h), E = On(s), A = wa(s), R = en(s) === "y", {
        width: D,
        height: S
      } = d.floating;
      let C, j;
      E === "top" || E === "bottom" ? (C = E, j = A === (await (m.isRTL == null ? void 0 : m.isRTL(v.floating)) ? "start" : "end") ? "left" : "right") : (j = E, C = A === "end" ? "top" : "bottom");
      const O = S - b.top - b.bottom, U = D - b.left - b.right, Y = al(S - b[C], O), k = al(D - b[j], U), I = !c.middlewareData.shift;
      let J = Y, X = k;
      if ((o = c.middlewareData.shift) != null && o.enabled.x && (X = U), (r = c.middlewareData.shift) != null && r.enabled.y && (J = O), I && !A) {
        const me = Mt(b.left, 0), be = Mt(b.right, 0), de = Mt(b.top, 0), ve = Mt(b.bottom, 0);
        R ? X = D - 2 * (me !== 0 || be !== 0 ? me + be : Mt(b.left, b.right)) : J = S - 2 * (de !== 0 || ve !== 0 ? de + ve : Mt(b.top, b.bottom));
      }
      await p({
        ...c,
        availableWidth: X,
        availableHeight: J
      });
      const ue = await m.getDimensions(v.floating);
      return D !== ue.width || S !== ue.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function sc() {
  return typeof window < "u";
}
function Ca(a) {
  return kv(a) ? (a.nodeName || "").toLowerCase() : "#document";
}
function Nt(a) {
  var c;
  return (a == null || (c = a.ownerDocument) == null ? void 0 : c.defaultView) || window;
}
function ln(a) {
  var c;
  return (c = (kv(a) ? a.ownerDocument : a.document) || window.document) == null ? void 0 : c.documentElement;
}
function kv(a) {
  return sc() ? a instanceof Node || a instanceof Nt(a).Node : !1;
}
function kt(a) {
  return sc() ? a instanceof Element || a instanceof Nt(a).Element : !1;
}
function _n(a) {
  return sc() ? a instanceof HTMLElement || a instanceof Nt(a).HTMLElement : !1;
}
function uv(a) {
  return !sc() || typeof ShadowRoot > "u" ? !1 : a instanceof ShadowRoot || a instanceof Nt(a).ShadowRoot;
}
function Ci(a) {
  const {
    overflow: c,
    overflowX: o,
    overflowY: r,
    display: s
  } = Jt(a);
  return /auto|scroll|overlay|hidden|clip/.test(c + r + o) && s !== "inline" && s !== "contents";
}
function jS(a) {
  return /^(table|td|th)$/.test(Ca(a));
}
function fc(a) {
  try {
    if (a.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return a.matches(":modal");
  } catch {
    return !1;
  }
}
const HS = /transform|translate|scale|rotate|perspective|filter/, LS = /paint|layout|strict|content/, Rl = (a) => !!a && a !== "none";
let Zr;
function xs(a) {
  const c = kt(a) ? Jt(a) : a;
  return Rl(c.transform) || Rl(c.translate) || Rl(c.scale) || Rl(c.rotate) || Rl(c.perspective) || !Es() && (Rl(c.backdropFilter) || Rl(c.filter)) || HS.test(c.willChange || "") || LS.test(c.contain || "");
}
function BS(a) {
  let c = il(a);
  for (; _n(c) && !Ta(c); ) {
    if (xs(c))
      return c;
    if (fc(c))
      return null;
    c = il(c);
  }
  return null;
}
function Es() {
  return Zr == null && (Zr = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Zr;
}
function Ta(a) {
  return /^(html|body|#document)$/.test(Ca(a));
}
function Jt(a) {
  return Nt(a).getComputedStyle(a);
}
function dc(a) {
  return kt(a) ? {
    scrollLeft: a.scrollLeft,
    scrollTop: a.scrollTop
  } : {
    scrollLeft: a.scrollX,
    scrollTop: a.scrollY
  };
}
function il(a) {
  if (Ca(a) === "html")
    return a;
  const c = (
    // Step into the shadow DOM of the parent of a slotted node.
    a.assignedSlot || // DOM Element detected.
    a.parentNode || // ShadowRoot detected.
    uv(a) && a.host || // Fallback.
    ln(a)
  );
  return uv(c) ? c.host : c;
}
function Jv(a) {
  const c = il(a);
  return Ta(c) ? a.ownerDocument ? a.ownerDocument.body : a.body : _n(c) && Ci(c) ? c : Jv(c);
}
function Ti(a, c, o) {
  var r;
  c === void 0 && (c = []), o === void 0 && (o = !0);
  const s = Jv(a), d = s === ((r = a.ownerDocument) == null ? void 0 : r.body), m = Nt(s);
  if (d) {
    const v = as(m);
    return c.concat(m, m.visualViewport || [], Ci(s) ? s : [], v && o ? Ti(v) : []);
  } else
    return c.concat(s, Ti(s, [], o));
}
function as(a) {
  return a.parent && Object.getPrototypeOf(a.parent) ? a.frameElement : null;
}
function Wv(a) {
  const c = Jt(a);
  let o = parseFloat(c.width) || 0, r = parseFloat(c.height) || 0;
  const s = _n(a), d = s ? a.offsetWidth : o, m = s ? a.offsetHeight : r, v = ic(o) !== d || ic(r) !== m;
  return v && (o = d, r = m), {
    width: o,
    height: r,
    $: v
  };
}
function As(a) {
  return kt(a) ? a : a.contextElement;
}
function Ea(a) {
  const c = As(a);
  if (!_n(c))
    return tn(1);
  const o = c.getBoundingClientRect(), {
    width: r,
    height: s,
    $: d
  } = Wv(c);
  let m = (d ? ic(o.width) : o.width) / r, v = (d ? ic(o.height) : o.height) / s;
  return (!m || !Number.isFinite(m)) && (m = 1), (!v || !Number.isFinite(v)) && (v = 1), {
    x: m,
    y: v
  };
}
const YS = /* @__PURE__ */ tn(0);
function $v(a) {
  const c = Nt(a);
  return !Es() || !c.visualViewport ? YS : {
    x: c.visualViewport.offsetLeft,
    y: c.visualViewport.offsetTop
  };
}
function qS(a, c, o) {
  return c === void 0 && (c = !1), !o || c && o !== Nt(a) ? !1 : c;
}
function Ml(a, c, o, r) {
  c === void 0 && (c = !1), o === void 0 && (o = !1);
  const s = a.getBoundingClientRect(), d = As(a);
  let m = tn(1);
  c && (r ? kt(r) && (m = Ea(r)) : m = Ea(a));
  const v = qS(d, o, r) ? $v(d) : tn(0);
  let p = (s.left + v.x) / m.x, h = (s.top + v.y) / m.y, b = s.width / m.x, E = s.height / m.y;
  if (d) {
    const A = Nt(d), R = r && kt(r) ? Nt(r) : r;
    let D = A, S = as(D);
    for (; S && r && R !== D; ) {
      const C = Ea(S), j = S.getBoundingClientRect(), O = Jt(S), U = j.left + (S.clientLeft + parseFloat(O.paddingLeft)) * C.x, Y = j.top + (S.clientTop + parseFloat(O.paddingTop)) * C.y;
      p *= C.x, h *= C.y, b *= C.x, E *= C.y, p += U, h += Y, D = Nt(S), S = as(D);
    }
  }
  return cc({
    width: b,
    height: E,
    x: p,
    y: h
  });
}
function mc(a, c) {
  const o = dc(a).scrollLeft;
  return c ? c.left + o : Ml(ln(a)).left + o;
}
function Fv(a, c) {
  const o = a.getBoundingClientRect(), r = o.left + c.scrollLeft - mc(a, o), s = o.top + c.scrollTop;
  return {
    x: r,
    y: s
  };
}
function GS(a) {
  let {
    elements: c,
    rect: o,
    offsetParent: r,
    strategy: s
  } = a;
  const d = s === "fixed", m = ln(r), v = c ? fc(c.floating) : !1;
  if (r === m || v && d)
    return o;
  let p = {
    scrollLeft: 0,
    scrollTop: 0
  }, h = tn(1);
  const b = tn(0), E = _n(r);
  if ((E || !E && !d) && ((Ca(r) !== "body" || Ci(m)) && (p = dc(r)), E)) {
    const R = Ml(r);
    h = Ea(r), b.x = R.x + r.clientLeft, b.y = R.y + r.clientTop;
  }
  const A = m && !E && !d ? Fv(m, p) : tn(0);
  return {
    width: o.width * h.x,
    height: o.height * h.y,
    x: o.x * h.x - p.scrollLeft * h.x + b.x + A.x,
    y: o.y * h.y - p.scrollTop * h.y + b.y + A.y
  };
}
function VS(a) {
  return Array.from(a.getClientRects());
}
function XS(a) {
  const c = ln(a), o = dc(a), r = a.ownerDocument.body, s = Mt(c.scrollWidth, c.clientWidth, r.scrollWidth, r.clientWidth), d = Mt(c.scrollHeight, c.clientHeight, r.scrollHeight, r.clientHeight);
  let m = -o.scrollLeft + mc(a);
  const v = -o.scrollTop;
  return Jt(r).direction === "rtl" && (m += Mt(c.clientWidth, r.clientWidth) - s), {
    width: s,
    height: d,
    x: m,
    y: v
  };
}
const cv = 25;
function QS(a, c) {
  const o = Nt(a), r = ln(a), s = o.visualViewport;
  let d = r.clientWidth, m = r.clientHeight, v = 0, p = 0;
  if (s) {
    d = s.width, m = s.height;
    const b = Es();
    (!b || b && c === "fixed") && (v = s.offsetLeft, p = s.offsetTop);
  }
  const h = mc(r);
  if (h <= 0) {
    const b = r.ownerDocument, E = b.body, A = getComputedStyle(E), R = b.compatMode === "CSS1Compat" && parseFloat(A.marginLeft) + parseFloat(A.marginRight) || 0, D = Math.abs(r.clientWidth - E.clientWidth - R);
    D <= cv && (d -= D);
  } else h <= cv && (d += h);
  return {
    width: d,
    height: m,
    x: v,
    y: p
  };
}
function ZS(a, c) {
  const o = Ml(a, !0, c === "fixed"), r = o.top + a.clientTop, s = o.left + a.clientLeft, d = _n(a) ? Ea(a) : tn(1), m = a.clientWidth * d.x, v = a.clientHeight * d.y, p = s * d.x, h = r * d.y;
  return {
    width: m,
    height: v,
    x: p,
    y: h
  };
}
function ov(a, c, o) {
  let r;
  if (c === "viewport")
    r = QS(a, o);
  else if (c === "document")
    r = XS(ln(a));
  else if (kt(c))
    r = ZS(c, o);
  else {
    const s = $v(a);
    r = {
      x: c.x - s.x,
      y: c.y - s.y,
      width: c.width,
      height: c.height
    };
  }
  return cc(r);
}
function Iv(a, c) {
  const o = il(a);
  return o === c || !kt(o) || Ta(o) ? !1 : Jt(o).position === "fixed" || Iv(o, c);
}
function KS(a, c) {
  const o = c.get(a);
  if (o)
    return o;
  let r = Ti(a, [], !1).filter((v) => kt(v) && Ca(v) !== "body"), s = null;
  const d = Jt(a).position === "fixed";
  let m = d ? il(a) : a;
  for (; kt(m) && !Ta(m); ) {
    const v = Jt(m), p = xs(m);
    !p && v.position === "fixed" && (s = null), (d ? !p && !s : !p && v.position === "static" && !!s && (s.position === "absolute" || s.position === "fixed") || Ci(m) && !p && Iv(a, m)) ? r = r.filter((b) => b !== m) : s = v, m = il(m);
  }
  return c.set(a, r), r;
}
function kS(a) {
  let {
    element: c,
    boundary: o,
    rootBoundary: r,
    strategy: s
  } = a;
  const m = [...o === "clippingAncestors" ? fc(c) ? [] : KS(c, this._c) : [].concat(o), r], v = ov(c, m[0], s);
  let p = v.top, h = v.right, b = v.bottom, E = v.left;
  for (let A = 1; A < m.length; A++) {
    const R = ov(c, m[A], s);
    p = Mt(R.top, p), h = al(R.right, h), b = al(R.bottom, b), E = Mt(R.left, E);
  }
  return {
    width: h - E,
    height: b - p,
    x: E,
    y: p
  };
}
function JS(a) {
  const {
    width: c,
    height: o
  } = Wv(a);
  return {
    width: c,
    height: o
  };
}
function WS(a, c, o) {
  const r = _n(c), s = ln(c), d = o === "fixed", m = Ml(a, !0, d, c);
  let v = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const p = tn(0);
  function h() {
    p.x = mc(s);
  }
  if (r || !r && !d)
    if ((Ca(c) !== "body" || Ci(s)) && (v = dc(c)), r) {
      const R = Ml(c, !0, d, c);
      p.x = R.x + c.clientLeft, p.y = R.y + c.clientTop;
    } else s && h();
  d && !r && s && h();
  const b = s && !r && !d ? Fv(s, v) : tn(0), E = m.left + v.scrollLeft - p.x - b.x, A = m.top + v.scrollTop - p.y - b.y;
  return {
    x: E,
    y: A,
    width: m.width,
    height: m.height
  };
}
function Kr(a) {
  return Jt(a).position === "static";
}
function rv(a, c) {
  if (!_n(a) || Jt(a).position === "fixed")
    return null;
  if (c)
    return c(a);
  let o = a.offsetParent;
  return ln(a) === o && (o = o.ownerDocument.body), o;
}
function Pv(a, c) {
  const o = Nt(a);
  if (fc(a))
    return o;
  if (!_n(a)) {
    let s = il(a);
    for (; s && !Ta(s); ) {
      if (kt(s) && !Kr(s))
        return s;
      s = il(s);
    }
    return o;
  }
  let r = rv(a, c);
  for (; r && jS(r) && Kr(r); )
    r = rv(r, c);
  return r && Ta(r) && Kr(r) && !xs(r) ? o : r || BS(a) || o;
}
const $S = async function(a) {
  const c = this.getOffsetParent || Pv, o = this.getDimensions, r = await o(a.floating);
  return {
    reference: WS(a.reference, await c(a.floating), a.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function FS(a) {
  return Jt(a).direction === "rtl";
}
const IS = {
  convertOffsetParentRelativeRectToViewportRelativeRect: GS,
  getDocumentElement: ln,
  getClippingRect: kS,
  getOffsetParent: Pv,
  getElementRects: $S,
  getClientRects: VS,
  getDimensions: JS,
  getScale: Ea,
  isElement: kt,
  isRTL: FS
};
function eg(a, c) {
  return a.x === c.x && a.y === c.y && a.width === c.width && a.height === c.height;
}
function PS(a, c) {
  let o = null, r;
  const s = ln(a);
  function d() {
    var v;
    clearTimeout(r), (v = o) == null || v.disconnect(), o = null;
  }
  function m(v, p) {
    v === void 0 && (v = !1), p === void 0 && (p = 1), d();
    const h = a.getBoundingClientRect(), {
      left: b,
      top: E,
      width: A,
      height: R
    } = h;
    if (v || c(), !A || !R)
      return;
    const D = ku(E), S = ku(s.clientWidth - (b + A)), C = ku(s.clientHeight - (E + R)), j = ku(b), U = {
      rootMargin: -D + "px " + -S + "px " + -C + "px " + -j + "px",
      threshold: Mt(0, al(1, p)) || 1
    };
    let Y = !0;
    function k(I) {
      const J = I[0].intersectionRatio;
      if (J !== p) {
        if (!Y)
          return m();
        J ? m(!1, J) : r = setTimeout(() => {
          m(!1, 1e-7);
        }, 1e3);
      }
      J === 1 && !eg(h, a.getBoundingClientRect()) && m(), Y = !1;
    }
    try {
      o = new IntersectionObserver(k, {
        ...U,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      o = new IntersectionObserver(k, U);
    }
    o.observe(a);
  }
  return m(!0), d;
}
function e1(a, c, o, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: d = !0,
    elementResize: m = typeof ResizeObserver == "function",
    layoutShift: v = typeof IntersectionObserver == "function",
    animationFrame: p = !1
  } = r, h = As(a), b = s || d ? [...h ? Ti(h) : [], ...c ? Ti(c) : []] : [];
  b.forEach((j) => {
    s && j.addEventListener("scroll", o, {
      passive: !0
    }), d && j.addEventListener("resize", o);
  });
  const E = h && v ? PS(h, o) : null;
  let A = -1, R = null;
  m && (R = new ResizeObserver((j) => {
    let [O] = j;
    O && O.target === h && R && c && (R.unobserve(c), cancelAnimationFrame(A), A = requestAnimationFrame(() => {
      var U;
      (U = R) == null || U.observe(c);
    })), o();
  }), h && !p && R.observe(h), c && R.observe(c));
  let D, S = p ? Ml(a) : null;
  p && C();
  function C() {
    const j = Ml(a);
    S && !eg(S, j) && o(), S = j, D = requestAnimationFrame(C);
  }
  return o(), () => {
    var j;
    b.forEach((O) => {
      s && O.removeEventListener("scroll", o), d && O.removeEventListener("resize", o);
    }), E == null || E(), (j = R) == null || j.disconnect(), R = null, p && cancelAnimationFrame(D);
  };
}
const t1 = MS, n1 = NS, l1 = _S, a1 = US, i1 = RS, sv = OS, u1 = DS, c1 = (a, c, o) => {
  const r = /* @__PURE__ */ new Map(), s = {
    platform: IS,
    ...o
  }, d = {
    ...s.platform,
    _c: r
  };
  return CS(a, c, {
    ...s,
    platform: d
  });
};
var o1 = typeof document < "u", r1 = function() {
}, Iu = o1 ? y.useLayoutEffect : r1;
function oc(a, c) {
  if (a === c)
    return !0;
  if (typeof a != typeof c)
    return !1;
  if (typeof a == "function" && a.toString() === c.toString())
    return !0;
  let o, r, s;
  if (a && c && typeof a == "object") {
    if (Array.isArray(a)) {
      if (o = a.length, o !== c.length) return !1;
      for (r = o; r-- !== 0; )
        if (!oc(a[r], c[r]))
          return !1;
      return !0;
    }
    if (s = Object.keys(a), o = s.length, o !== Object.keys(c).length)
      return !1;
    for (r = o; r-- !== 0; )
      if (!{}.hasOwnProperty.call(c, s[r]))
        return !1;
    for (r = o; r-- !== 0; ) {
      const d = s[r];
      if (!(d === "_owner" && a.$$typeof) && !oc(a[d], c[d]))
        return !1;
    }
    return !0;
  }
  return a !== a && c !== c;
}
function tg(a) {
  return typeof window > "u" ? 1 : (a.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function fv(a, c) {
  const o = tg(a);
  return Math.round(c * o) / o;
}
function kr(a) {
  const c = y.useRef(a);
  return Iu(() => {
    c.current = a;
  }), c;
}
function s1(a) {
  a === void 0 && (a = {});
  const {
    placement: c = "bottom",
    strategy: o = "absolute",
    middleware: r = [],
    platform: s,
    elements: {
      reference: d,
      floating: m
    } = {},
    transform: v = !0,
    whileElementsMounted: p,
    open: h
  } = a, [b, E] = y.useState({
    x: 0,
    y: 0,
    strategy: o,
    placement: c,
    middlewareData: {},
    isPositioned: !1
  }), [A, R] = y.useState(r);
  oc(A, r) || R(r);
  const [D, S] = y.useState(null), [C, j] = y.useState(null), O = y.useCallback((G) => {
    G !== I.current && (I.current = G, S(G));
  }, []), U = y.useCallback((G) => {
    G !== J.current && (J.current = G, j(G));
  }, []), Y = d || D, k = m || C, I = y.useRef(null), J = y.useRef(null), X = y.useRef(b), ue = p != null, me = kr(p), be = kr(s), de = kr(h), ve = y.useCallback(() => {
    if (!I.current || !J.current)
      return;
    const G = {
      placement: c,
      strategy: o,
      middleware: A
    };
    be.current && (G.platform = be.current), c1(I.current, J.current, G).then((le) => {
      const W = {
        ...le,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: de.current !== !1
      };
      ge.current && !oc(X.current, W) && (X.current = W, wi.flushSync(() => {
        E(W);
      }));
    });
  }, [A, c, o, be, de]);
  Iu(() => {
    h === !1 && X.current.isPositioned && (X.current.isPositioned = !1, E((G) => ({
      ...G,
      isPositioned: !1
    })));
  }, [h]);
  const ge = y.useRef(!1);
  Iu(() => (ge.current = !0, () => {
    ge.current = !1;
  }), []), Iu(() => {
    if (Y && (I.current = Y), k && (J.current = k), Y && k) {
      if (me.current)
        return me.current(Y, k, ve);
      ve();
    }
  }, [Y, k, ve, me, ue]);
  const pe = y.useMemo(() => ({
    reference: I,
    floating: J,
    setReference: O,
    setFloating: U
  }), [O, U]), V = y.useMemo(() => ({
    reference: Y,
    floating: k
  }), [Y, k]), B = y.useMemo(() => {
    const G = {
      position: o,
      left: 0,
      top: 0
    };
    if (!V.floating)
      return G;
    const le = fv(V.floating, b.x), W = fv(V.floating, b.y);
    return v ? {
      ...G,
      transform: "translate(" + le + "px, " + W + "px)",
      ...tg(V.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: o,
      left: le,
      top: W
    };
  }, [o, v, V.floating, b.x, b.y]);
  return y.useMemo(() => ({
    ...b,
    update: ve,
    refs: pe,
    elements: V,
    floatingStyles: B
  }), [b, ve, pe, V, B]);
}
const f1 = (a) => {
  function c(o) {
    return {}.hasOwnProperty.call(o, "current");
  }
  return {
    name: "arrow",
    options: a,
    fn(o) {
      const {
        element: r,
        padding: s
      } = typeof a == "function" ? a(o) : a;
      return r && c(r) ? r.current != null ? sv({
        element: r.current,
        padding: s
      }).fn(o) : {} : r ? sv({
        element: r,
        padding: s
      }).fn(o) : {};
    }
  };
}, d1 = (a, c) => {
  const o = t1(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, c]
  };
}, m1 = (a, c) => {
  const o = n1(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, c]
  };
}, h1 = (a, c) => ({
  fn: u1(a).fn,
  options: [a, c]
}), v1 = (a, c) => {
  const o = l1(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, c]
  };
}, g1 = (a, c) => {
  const o = a1(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, c]
  };
}, p1 = (a, c) => {
  const o = i1(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, c]
  };
}, y1 = (a, c) => {
  const o = f1(a);
  return {
    name: o.name,
    fn: o.fn,
    options: [a, c]
  };
};
var b1 = "Arrow", ng = y.forwardRef((a, c) => {
  const { children: o, width: r = 10, height: s = 5, ...d } = a;
  return /* @__PURE__ */ L.jsx(
    ke.svg,
    {
      ...d,
      ref: c,
      width: r,
      height: s,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: a.asChild ? o : /* @__PURE__ */ L.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
ng.displayName = b1;
var S1 = ng;
function x1(a) {
  const [c, o] = y.useState(void 0);
  return bt(() => {
    if (a) {
      o({ width: a.offsetWidth, height: a.offsetHeight });
      const r = new ResizeObserver((s) => {
        if (!Array.isArray(s) || !s.length)
          return;
        const d = s[0];
        let m, v;
        if ("borderBoxSize" in d) {
          const p = d.borderBoxSize, h = Array.isArray(p) ? p[0] : p;
          m = h.inlineSize, v = h.blockSize;
        } else
          m = a.offsetWidth, v = a.offsetHeight;
        o({ width: m, height: v });
      });
      return r.observe(a, { box: "border-box" }), () => r.unobserve(a);
    } else
      o(void 0);
  }, [a]), c;
}
var Ts = "Popper", [lg, ag] = gs(Ts), [E1, ig] = lg(Ts), ug = (a) => {
  const { __scopePopper: c, children: o } = a, [r, s] = y.useState(null);
  return /* @__PURE__ */ L.jsx(E1, { scope: c, anchor: r, onAnchorChange: s, children: o });
};
ug.displayName = Ts;
var cg = "PopperAnchor", og = y.forwardRef(
  (a, c) => {
    const { __scopePopper: o, virtualRef: r, ...s } = a, d = ig(cg, o), m = y.useRef(null), v = rt(c, m), p = y.useRef(null);
    return y.useEffect(() => {
      const h = p.current;
      p.current = (r == null ? void 0 : r.current) || m.current, h !== p.current && d.onAnchorChange(p.current);
    }), r ? null : /* @__PURE__ */ L.jsx(ke.div, { ...s, ref: v });
  }
);
og.displayName = cg;
var ws = "PopperContent", [A1, T1] = lg(ws), rg = y.forwardRef(
  (a, c) => {
    var F, ce, re, se, xe, Ae;
    const {
      __scopePopper: o,
      side: r = "bottom",
      sideOffset: s = 0,
      align: d = "center",
      alignOffset: m = 0,
      arrowPadding: v = 0,
      avoidCollisions: p = !0,
      collisionBoundary: h = [],
      collisionPadding: b = 0,
      sticky: E = "partial",
      hideWhenDetached: A = !1,
      updatePositionStrategy: R = "optimized",
      onPlaced: D,
      ...S
    } = a, C = ig(ws, o), [j, O] = y.useState(null), U = rt(c, (Qe) => O(Qe)), [Y, k] = y.useState(null), I = x1(Y), J = (I == null ? void 0 : I.width) ?? 0, X = (I == null ? void 0 : I.height) ?? 0, ue = r + (d !== "center" ? "-" + d : ""), me = typeof b == "number" ? b : { top: 0, right: 0, bottom: 0, left: 0, ...b }, be = Array.isArray(h) ? h : [h], de = be.length > 0, ve = {
      padding: me,
      boundary: be.filter(C1),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: de
    }, { refs: ge, floatingStyles: pe, placement: V, isPositioned: B, middlewareData: G } = s1({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: ue,
      whileElementsMounted: (...Qe) => e1(...Qe, {
        animationFrame: R === "always"
      }),
      elements: {
        reference: C.anchor
      },
      middleware: [
        d1({ mainAxis: s + X, alignmentAxis: m }),
        p && m1({
          mainAxis: !0,
          crossAxis: !1,
          limiter: E === "partial" ? h1() : void 0,
          ...ve
        }),
        p && v1({ ...ve }),
        g1({
          ...ve,
          apply: ({ elements: Qe, rects: tt, availableWidth: St, availableHeight: an }) => {
            const { width: un, height: yc } = tt.reference, rl = Qe.floating.style;
            rl.setProperty("--radix-popper-available-width", `${St}px`), rl.setProperty("--radix-popper-available-height", `${an}px`), rl.setProperty("--radix-popper-anchor-width", `${un}px`), rl.setProperty("--radix-popper-anchor-height", `${yc}px`);
          }
        }),
        Y && y1({ element: Y, padding: v }),
        O1({ arrowWidth: J, arrowHeight: X }),
        A && p1({ strategy: "referenceHidden", ...ve })
      ]
    }), [le, W] = dg(V), Be = zl(D);
    bt(() => {
      B && (Be == null || Be());
    }, [B, Be]);
    const T = (F = G.arrow) == null ? void 0 : F.x, Q = (ce = G.arrow) == null ? void 0 : ce.y, $ = ((re = G.arrow) == null ? void 0 : re.centerOffset) !== 0, [P, ae] = y.useState();
    return bt(() => {
      j && ae(window.getComputedStyle(j).zIndex);
    }, [j]), /* @__PURE__ */ L.jsx(
      "div",
      {
        ref: ge.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...pe,
          transform: B ? pe.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: P,
          "--radix-popper-transform-origin": [
            (se = G.transformOrigin) == null ? void 0 : se.x,
            (xe = G.transformOrigin) == null ? void 0 : xe.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((Ae = G.hide) == null ? void 0 : Ae.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: a.dir,
        children: /* @__PURE__ */ L.jsx(
          A1,
          {
            scope: o,
            placedSide: le,
            onArrowChange: k,
            arrowX: T,
            arrowY: Q,
            shouldHideArrow: $,
            children: /* @__PURE__ */ L.jsx(
              ke.div,
              {
                "data-side": le,
                "data-align": W,
                ...S,
                ref: U,
                style: {
                  ...S.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: B ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
rg.displayName = ws;
var sg = "PopperArrow", w1 = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, fg = y.forwardRef(function(c, o) {
  const { __scopePopper: r, ...s } = c, d = T1(sg, r), m = w1[d.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ L.jsx(
      "span",
      {
        ref: d.onArrowChange,
        style: {
          position: "absolute",
          left: d.arrowX,
          top: d.arrowY,
          [m]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[d.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[d.placedSide],
          visibility: d.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ L.jsx(
          S1,
          {
            ...s,
            ref: o,
            style: {
              ...s.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
fg.displayName = sg;
function C1(a) {
  return a !== null;
}
var O1 = (a) => ({
  name: "transformOrigin",
  options: a,
  fn(c) {
    var C, j, O;
    const { placement: o, rects: r, middlewareData: s } = c, m = ((C = s.arrow) == null ? void 0 : C.centerOffset) !== 0, v = m ? 0 : a.arrowWidth, p = m ? 0 : a.arrowHeight, [h, b] = dg(o), E = { start: "0%", center: "50%", end: "100%" }[b], A = (((j = s.arrow) == null ? void 0 : j.x) ?? 0) + v / 2, R = (((O = s.arrow) == null ? void 0 : O.y) ?? 0) + p / 2;
    let D = "", S = "";
    return h === "bottom" ? (D = m ? E : `${A}px`, S = `${-p}px`) : h === "top" ? (D = m ? E : `${A}px`, S = `${r.floating.height + p}px`) : h === "right" ? (D = `${-p}px`, S = m ? E : `${R}px`) : h === "left" && (D = `${r.floating.width + p}px`, S = m ? E : `${R}px`), { data: { x: D, y: S } };
  }
});
function dg(a) {
  const [c, o = "center"] = a.split("-");
  return [c, o];
}
var _1 = ug, R1 = og, z1 = rg, M1 = fg, N1 = "Portal", mg = y.forwardRef((a, c) => {
  var v;
  const { container: o, ...r } = a, [s, d] = y.useState(!1);
  bt(() => d(!0), []);
  const m = o || s && ((v = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : v.body);
  return m ? Y0.createPortal(/* @__PURE__ */ L.jsx(ke.div, { ...r, ref: c }), m) : null;
});
mg.displayName = N1;
var D1 = ds[" useInsertionEffect ".trim().toString()] || bt;
function dv({
  prop: a,
  defaultProp: c,
  onChange: o = () => {
  },
  caller: r
}) {
  const [s, d, m] = U1({
    defaultProp: c,
    onChange: o
  }), v = a !== void 0, p = v ? a : s;
  {
    const b = y.useRef(a !== void 0);
    y.useEffect(() => {
      const E = b.current;
      E !== v && console.warn(
        `${r} is changing from ${E ? "controlled" : "uncontrolled"} to ${v ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), b.current = v;
    }, [v, r]);
  }
  const h = y.useCallback(
    (b) => {
      var E;
      if (v) {
        const A = j1(b) ? b(a) : b;
        A !== a && ((E = m.current) == null || E.call(m, A));
      } else
        d(b);
    },
    [v, a, d, m]
  );
  return [p, h];
}
function U1({
  defaultProp: a,
  onChange: c
}) {
  const [o, r] = y.useState(a), s = y.useRef(o), d = y.useRef(c);
  return D1(() => {
    d.current = c;
  }, [c]), y.useEffect(() => {
    var m;
    s.current !== o && ((m = d.current) == null || m.call(d, o), s.current = o);
  }, [o, s]), [o, r, d];
}
function j1(a) {
  return typeof a == "function";
}
function H1(a) {
  const c = y.useRef({ value: a, previous: a });
  return y.useMemo(() => (c.current.value !== a && (c.current.previous = c.current.value, c.current.value = a), c.current.previous), [a]);
}
var hg = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), L1 = "VisuallyHidden", B1 = y.forwardRef(
  (a, c) => /* @__PURE__ */ L.jsx(
    ke.span,
    {
      ...a,
      ref: c,
      style: { ...hg, ...a.style }
    }
  )
);
B1.displayName = L1;
var Y1 = function(a) {
  if (typeof document > "u")
    return null;
  var c = Array.isArray(a) ? a[0] : a;
  return c.ownerDocument.body;
}, ba = /* @__PURE__ */ new WeakMap(), Ju = /* @__PURE__ */ new WeakMap(), Wu = {}, Jr = 0, vg = function(a) {
  return a && (a.host || vg(a.parentNode));
}, q1 = function(a, c) {
  return c.map(function(o) {
    if (a.contains(o))
      return o;
    var r = vg(o);
    return r && a.contains(r) ? r : (console.error("aria-hidden", o, "in not contained inside", a, ". Doing nothing"), null);
  }).filter(function(o) {
    return !!o;
  });
}, G1 = function(a, c, o, r) {
  var s = q1(c, Array.isArray(a) ? a : [a]);
  Wu[o] || (Wu[o] = /* @__PURE__ */ new WeakMap());
  var d = Wu[o], m = [], v = /* @__PURE__ */ new Set(), p = new Set(s), h = function(E) {
    !E || v.has(E) || (v.add(E), h(E.parentNode));
  };
  s.forEach(h);
  var b = function(E) {
    !E || p.has(E) || Array.prototype.forEach.call(E.children, function(A) {
      if (v.has(A))
        b(A);
      else
        try {
          var R = A.getAttribute(r), D = R !== null && R !== "false", S = (ba.get(A) || 0) + 1, C = (d.get(A) || 0) + 1;
          ba.set(A, S), d.set(A, C), m.push(A), S === 1 && D && Ju.set(A, !0), C === 1 && A.setAttribute(o, "true"), D || A.setAttribute(r, "true");
        } catch (j) {
          console.error("aria-hidden: cannot operate on ", A, j);
        }
    });
  };
  return b(c), v.clear(), Jr++, function() {
    m.forEach(function(E) {
      var A = ba.get(E) - 1, R = d.get(E) - 1;
      ba.set(E, A), d.set(E, R), A || (Ju.has(E) || E.removeAttribute(r), Ju.delete(E)), R || E.removeAttribute(o);
    }), Jr--, Jr || (ba = /* @__PURE__ */ new WeakMap(), ba = /* @__PURE__ */ new WeakMap(), Ju = /* @__PURE__ */ new WeakMap(), Wu = {});
  };
}, V1 = function(a, c, o) {
  o === void 0 && (o = "data-aria-hidden");
  var r = Array.from(Array.isArray(a) ? a : [a]), s = Y1(a);
  return s ? (r.push.apply(r, Array.from(s.querySelectorAll("[aria-live], script"))), G1(r, s, o, "aria-hidden")) : function() {
    return null;
  };
}, Pt = function() {
  return Pt = Object.assign || function(c) {
    for (var o, r = 1, s = arguments.length; r < s; r++) {
      o = arguments[r];
      for (var d in o) Object.prototype.hasOwnProperty.call(o, d) && (c[d] = o[d]);
    }
    return c;
  }, Pt.apply(this, arguments);
};
function gg(a, c) {
  var o = {};
  for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && c.indexOf(r) < 0 && (o[r] = a[r]);
  if (a != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, r = Object.getOwnPropertySymbols(a); s < r.length; s++)
      c.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(a, r[s]) && (o[r[s]] = a[r[s]]);
  return o;
}
function X1(a, c, o) {
  if (o || arguments.length === 2) for (var r = 0, s = c.length, d; r < s; r++)
    (d || !(r in c)) && (d || (d = Array.prototype.slice.call(c, 0, r)), d[r] = c[r]);
  return a.concat(d || Array.prototype.slice.call(c));
}
var Pu = "right-scroll-bar-position", ec = "width-before-scroll-bar", Q1 = "with-scroll-bars-hidden", Z1 = "--removed-body-scroll-bar-size";
function Wr(a, c) {
  return typeof a == "function" ? a(c) : a && (a.current = c), a;
}
function K1(a, c) {
  var o = y.useState(function() {
    return {
      // value
      value: a,
      // last callback
      callback: c,
      // "memoized" public interface
      facade: {
        get current() {
          return o.value;
        },
        set current(r) {
          var s = o.value;
          s !== r && (o.value = r, o.callback(r, s));
        }
      }
    };
  })[0];
  return o.callback = c, o.facade;
}
var k1 = typeof window < "u" ? y.useLayoutEffect : y.useEffect, mv = /* @__PURE__ */ new WeakMap();
function J1(a, c) {
  var o = K1(null, function(r) {
    return a.forEach(function(s) {
      return Wr(s, r);
    });
  });
  return k1(function() {
    var r = mv.get(o);
    if (r) {
      var s = new Set(r), d = new Set(a), m = o.current;
      s.forEach(function(v) {
        d.has(v) || Wr(v, null);
      }), d.forEach(function(v) {
        s.has(v) || Wr(v, m);
      });
    }
    mv.set(o, a);
  }, [a]), o;
}
function W1(a) {
  return a;
}
function $1(a, c) {
  c === void 0 && (c = W1);
  var o = [], r = !1, s = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return o.length ? o[o.length - 1] : a;
    },
    useMedium: function(d) {
      var m = c(d, r);
      return o.push(m), function() {
        o = o.filter(function(v) {
          return v !== m;
        });
      };
    },
    assignSyncMedium: function(d) {
      for (r = !0; o.length; ) {
        var m = o;
        o = [], m.forEach(d);
      }
      o = {
        push: function(v) {
          return d(v);
        },
        filter: function() {
          return o;
        }
      };
    },
    assignMedium: function(d) {
      r = !0;
      var m = [];
      if (o.length) {
        var v = o;
        o = [], v.forEach(d), m = o;
      }
      var p = function() {
        var b = m;
        m = [], b.forEach(d);
      }, h = function() {
        return Promise.resolve().then(p);
      };
      h(), o = {
        push: function(b) {
          m.push(b), h();
        },
        filter: function(b) {
          return m = m.filter(b), o;
        }
      };
    }
  };
  return s;
}
function F1(a) {
  a === void 0 && (a = {});
  var c = $1(null);
  return c.options = Pt({ async: !0, ssr: !1 }, a), c;
}
var pg = function(a) {
  var c = a.sideCar, o = gg(a, ["sideCar"]);
  if (!c)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = c.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return y.createElement(r, Pt({}, o));
};
pg.isSideCarExport = !0;
function I1(a, c) {
  return a.useMedium(c), pg;
}
var yg = F1(), $r = function() {
}, hc = y.forwardRef(function(a, c) {
  var o = y.useRef(null), r = y.useState({
    onScrollCapture: $r,
    onWheelCapture: $r,
    onTouchMoveCapture: $r
  }), s = r[0], d = r[1], m = a.forwardProps, v = a.children, p = a.className, h = a.removeScrollBar, b = a.enabled, E = a.shards, A = a.sideCar, R = a.noRelative, D = a.noIsolation, S = a.inert, C = a.allowPinchZoom, j = a.as, O = j === void 0 ? "div" : j, U = a.gapMode, Y = gg(a, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), k = A, I = J1([o, c]), J = Pt(Pt({}, Y), s);
  return y.createElement(
    y.Fragment,
    null,
    b && y.createElement(k, { sideCar: yg, removeScrollBar: h, shards: E, noRelative: R, noIsolation: D, inert: S, setCallbacks: d, allowPinchZoom: !!C, lockRef: o, gapMode: U }),
    m ? y.cloneElement(y.Children.only(v), Pt(Pt({}, J), { ref: I })) : y.createElement(O, Pt({}, J, { className: p, ref: I }), v)
  );
});
hc.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
hc.classNames = {
  fullWidth: ec,
  zeroRight: Pu
};
var P1 = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function ex() {
  if (!document)
    return null;
  var a = document.createElement("style");
  a.type = "text/css";
  var c = P1();
  return c && a.setAttribute("nonce", c), a;
}
function tx(a, c) {
  a.styleSheet ? a.styleSheet.cssText = c : a.appendChild(document.createTextNode(c));
}
function nx(a) {
  var c = document.head || document.getElementsByTagName("head")[0];
  c.appendChild(a);
}
var lx = function() {
  var a = 0, c = null;
  return {
    add: function(o) {
      a == 0 && (c = ex()) && (tx(c, o), nx(c)), a++;
    },
    remove: function() {
      a--, !a && c && (c.parentNode && c.parentNode.removeChild(c), c = null);
    }
  };
}, ax = function() {
  var a = lx();
  return function(c, o) {
    y.useEffect(function() {
      return a.add(c), function() {
        a.remove();
      };
    }, [c && o]);
  };
}, bg = function() {
  var a = ax(), c = function(o) {
    var r = o.styles, s = o.dynamic;
    return a(r, s), null;
  };
  return c;
}, ix = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Fr = function(a) {
  return parseInt(a || "", 10) || 0;
}, ux = function(a) {
  var c = window.getComputedStyle(document.body), o = c[a === "padding" ? "paddingLeft" : "marginLeft"], r = c[a === "padding" ? "paddingTop" : "marginTop"], s = c[a === "padding" ? "paddingRight" : "marginRight"];
  return [Fr(o), Fr(r), Fr(s)];
}, cx = function(a) {
  if (a === void 0 && (a = "margin"), typeof window > "u")
    return ix;
  var c = ux(a), o = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: c[0],
    top: c[1],
    right: c[2],
    gap: Math.max(0, r - o + c[2] - c[0])
  };
}, ox = bg(), Aa = "data-scroll-locked", rx = function(a, c, o, r) {
  var s = a.left, d = a.top, m = a.right, v = a.gap;
  return o === void 0 && (o = "margin"), `
  .`.concat(Q1, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(v, "px ").concat(r, `;
  }
  body[`).concat(Aa, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    c && "position: relative ".concat(r, ";"),
    o === "margin" && `
    padding-left: `.concat(s, `px;
    padding-top: `).concat(d, `px;
    padding-right: `).concat(m, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(v, "px ").concat(r, `;
    `),
    o === "padding" && "padding-right: ".concat(v, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Pu, ` {
    right: `).concat(v, "px ").concat(r, `;
  }
  
  .`).concat(ec, ` {
    margin-right: `).concat(v, "px ").concat(r, `;
  }
  
  .`).concat(Pu, " .").concat(Pu, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(ec, " .").concat(ec, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Aa, `] {
    `).concat(Z1, ": ").concat(v, `px;
  }
`);
}, hv = function() {
  var a = parseInt(document.body.getAttribute(Aa) || "0", 10);
  return isFinite(a) ? a : 0;
}, sx = function() {
  y.useEffect(function() {
    return document.body.setAttribute(Aa, (hv() + 1).toString()), function() {
      var a = hv() - 1;
      a <= 0 ? document.body.removeAttribute(Aa) : document.body.setAttribute(Aa, a.toString());
    };
  }, []);
}, fx = function(a) {
  var c = a.noRelative, o = a.noImportant, r = a.gapMode, s = r === void 0 ? "margin" : r;
  sx();
  var d = y.useMemo(function() {
    return cx(s);
  }, [s]);
  return y.createElement(ox, { styles: rx(d, !c, s, o ? "" : "!important") });
}, is = !1;
if (typeof window < "u")
  try {
    var $u = Object.defineProperty({}, "passive", {
      get: function() {
        return is = !0, !0;
      }
    });
    window.addEventListener("test", $u, $u), window.removeEventListener("test", $u, $u);
  } catch {
    is = !1;
  }
var Sa = is ? { passive: !1 } : !1, dx = function(a) {
  return a.tagName === "TEXTAREA";
}, Sg = function(a, c) {
  if (!(a instanceof Element))
    return !1;
  var o = window.getComputedStyle(a);
  return (
    // not-not-scrollable
    o[c] !== "hidden" && // contains scroll inside self
    !(o.overflowY === o.overflowX && !dx(a) && o[c] === "visible")
  );
}, mx = function(a) {
  return Sg(a, "overflowY");
}, hx = function(a) {
  return Sg(a, "overflowX");
}, vv = function(a, c) {
  var o = c.ownerDocument, r = c;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var s = xg(a, r);
    if (s) {
      var d = Eg(a, r), m = d[1], v = d[2];
      if (m > v)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== o.body);
  return !1;
}, vx = function(a) {
  var c = a.scrollTop, o = a.scrollHeight, r = a.clientHeight;
  return [
    c,
    o,
    r
  ];
}, gx = function(a) {
  var c = a.scrollLeft, o = a.scrollWidth, r = a.clientWidth;
  return [
    c,
    o,
    r
  ];
}, xg = function(a, c) {
  return a === "v" ? mx(c) : hx(c);
}, Eg = function(a, c) {
  return a === "v" ? vx(c) : gx(c);
}, px = function(a, c) {
  return a === "h" && c === "rtl" ? -1 : 1;
}, yx = function(a, c, o, r, s) {
  var d = px(a, window.getComputedStyle(c).direction), m = d * r, v = o.target, p = c.contains(v), h = !1, b = m > 0, E = 0, A = 0;
  do {
    if (!v)
      break;
    var R = Eg(a, v), D = R[0], S = R[1], C = R[2], j = S - C - d * D;
    (D || j) && xg(a, v) && (E += j, A += D);
    var O = v.parentNode;
    v = O && O.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? O.host : O;
  } while (
    // portaled content
    !p && v !== document.body || // self content
    p && (c.contains(v) || c === v)
  );
  return (b && Math.abs(E) < 1 || !b && Math.abs(A) < 1) && (h = !0), h;
}, Fu = function(a) {
  return "changedTouches" in a ? [a.changedTouches[0].clientX, a.changedTouches[0].clientY] : [0, 0];
}, gv = function(a) {
  return [a.deltaX, a.deltaY];
}, pv = function(a) {
  return a && "current" in a ? a.current : a;
}, bx = function(a, c) {
  return a[0] === c[0] && a[1] === c[1];
}, Sx = function(a) {
  return `
  .block-interactivity-`.concat(a, ` {pointer-events: none;}
  .allow-interactivity-`).concat(a, ` {pointer-events: all;}
`);
}, xx = 0, xa = [];
function Ex(a) {
  var c = y.useRef([]), o = y.useRef([0, 0]), r = y.useRef(), s = y.useState(xx++)[0], d = y.useState(bg)[0], m = y.useRef(a);
  y.useEffect(function() {
    m.current = a;
  }, [a]), y.useEffect(function() {
    if (a.inert) {
      document.body.classList.add("block-interactivity-".concat(s));
      var S = X1([a.lockRef.current], (a.shards || []).map(pv), !0).filter(Boolean);
      return S.forEach(function(C) {
        return C.classList.add("allow-interactivity-".concat(s));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(s)), S.forEach(function(C) {
          return C.classList.remove("allow-interactivity-".concat(s));
        });
      };
    }
  }, [a.inert, a.lockRef.current, a.shards]);
  var v = y.useCallback(function(S, C) {
    if ("touches" in S && S.touches.length === 2 || S.type === "wheel" && S.ctrlKey)
      return !m.current.allowPinchZoom;
    var j = Fu(S), O = o.current, U = "deltaX" in S ? S.deltaX : O[0] - j[0], Y = "deltaY" in S ? S.deltaY : O[1] - j[1], k, I = S.target, J = Math.abs(U) > Math.abs(Y) ? "h" : "v";
    if ("touches" in S && J === "h" && I.type === "range")
      return !1;
    var X = window.getSelection(), ue = X && X.anchorNode, me = ue ? ue === I || ue.contains(I) : !1;
    if (me)
      return !1;
    var be = vv(J, I);
    if (!be)
      return !0;
    if (be ? k = J : (k = J === "v" ? "h" : "v", be = vv(J, I)), !be)
      return !1;
    if (!r.current && "changedTouches" in S && (U || Y) && (r.current = k), !k)
      return !0;
    var de = r.current || k;
    return yx(de, C, S, de === "h" ? U : Y);
  }, []), p = y.useCallback(function(S) {
    var C = S;
    if (!(!xa.length || xa[xa.length - 1] !== d)) {
      var j = "deltaY" in C ? gv(C) : Fu(C), O = c.current.filter(function(k) {
        return k.name === C.type && (k.target === C.target || C.target === k.shadowParent) && bx(k.delta, j);
      })[0];
      if (O && O.should) {
        C.cancelable && C.preventDefault();
        return;
      }
      if (!O) {
        var U = (m.current.shards || []).map(pv).filter(Boolean).filter(function(k) {
          return k.contains(C.target);
        }), Y = U.length > 0 ? v(C, U[0]) : !m.current.noIsolation;
        Y && C.cancelable && C.preventDefault();
      }
    }
  }, []), h = y.useCallback(function(S, C, j, O) {
    var U = { name: S, delta: C, target: j, should: O, shadowParent: Ax(j) };
    c.current.push(U), setTimeout(function() {
      c.current = c.current.filter(function(Y) {
        return Y !== U;
      });
    }, 1);
  }, []), b = y.useCallback(function(S) {
    o.current = Fu(S), r.current = void 0;
  }, []), E = y.useCallback(function(S) {
    h(S.type, gv(S), S.target, v(S, a.lockRef.current));
  }, []), A = y.useCallback(function(S) {
    h(S.type, Fu(S), S.target, v(S, a.lockRef.current));
  }, []);
  y.useEffect(function() {
    return xa.push(d), a.setCallbacks({
      onScrollCapture: E,
      onWheelCapture: E,
      onTouchMoveCapture: A
    }), document.addEventListener("wheel", p, Sa), document.addEventListener("touchmove", p, Sa), document.addEventListener("touchstart", b, Sa), function() {
      xa = xa.filter(function(S) {
        return S !== d;
      }), document.removeEventListener("wheel", p, Sa), document.removeEventListener("touchmove", p, Sa), document.removeEventListener("touchstart", b, Sa);
    };
  }, []);
  var R = a.removeScrollBar, D = a.inert;
  return y.createElement(
    y.Fragment,
    null,
    D ? y.createElement(d, { styles: Sx(s) }) : null,
    R ? y.createElement(fx, { noRelative: a.noRelative, gapMode: a.gapMode }) : null
  );
}
function Ax(a) {
  for (var c = null; a !== null; )
    a instanceof ShadowRoot && (c = a.host, a = a.host), a = a.parentNode;
  return c;
}
const Tx = I1(yg, Ex);
var Ag = y.forwardRef(function(a, c) {
  return y.createElement(hc, Pt({}, a, { ref: c, sideCar: Tx }));
});
Ag.classNames = hc.classNames;
var wx = [" ", "Enter", "ArrowUp", "ArrowDown"], Cx = [" ", "Enter"], Nl = "Select", [vc, gc, Ox] = K0(Nl), [Oa] = gs(Nl, [
  Ox,
  ag
]), pc = ag(), [_x, cl] = Oa(Nl), [Rx, zx] = Oa(Nl), Tg = (a) => {
  const {
    __scopeSelect: c,
    children: o,
    open: r,
    defaultOpen: s,
    onOpenChange: d,
    value: m,
    defaultValue: v,
    onValueChange: p,
    dir: h,
    name: b,
    autoComplete: E,
    disabled: A,
    required: R,
    form: D
  } = a, S = pc(c), [C, j] = y.useState(null), [O, U] = y.useState(null), [Y, k] = y.useState(!1), I = J0(h), [J, X] = dv({
    prop: r,
    defaultProp: s ?? !1,
    onChange: d,
    caller: Nl
  }), [ue, me] = dv({
    prop: m,
    defaultProp: v,
    onChange: p,
    caller: Nl
  }), be = y.useRef(null), de = C ? D || !!C.closest("form") : !0, [ve, ge] = y.useState(/* @__PURE__ */ new Set()), pe = Array.from(ve).map((V) => V.props.value).join(";");
  return /* @__PURE__ */ L.jsx(_1, { ...S, children: /* @__PURE__ */ L.jsxs(
    _x,
    {
      required: R,
      scope: c,
      trigger: C,
      onTriggerChange: j,
      valueNode: O,
      onValueNodeChange: U,
      valueNodeHasChildren: Y,
      onValueNodeHasChildrenChange: k,
      contentId: ps(),
      value: ue,
      onValueChange: me,
      open: J,
      onOpenChange: X,
      dir: I,
      triggerPointerDownPosRef: be,
      disabled: A,
      children: [
        /* @__PURE__ */ L.jsx(vc.Provider, { scope: c, children: /* @__PURE__ */ L.jsx(
          Rx,
          {
            scope: a.__scopeSelect,
            onNativeOptionAdd: y.useCallback((V) => {
              ge((B) => new Set(B).add(V));
            }, []),
            onNativeOptionRemove: y.useCallback((V) => {
              ge((B) => {
                const G = new Set(B);
                return G.delete(V), G;
              });
            }, []),
            children: o
          }
        ) }),
        de ? /* @__PURE__ */ L.jsxs(
          Qg,
          {
            "aria-hidden": !0,
            required: R,
            tabIndex: -1,
            name: b,
            autoComplete: E,
            value: ue,
            onChange: (V) => me(V.target.value),
            disabled: A,
            form: D,
            children: [
              ue === void 0 ? /* @__PURE__ */ L.jsx("option", { value: "" }) : null,
              Array.from(ve)
            ]
          },
          pe
        ) : null
      ]
    }
  ) });
};
Tg.displayName = Nl;
var wg = "SelectTrigger", Cg = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, disabled: r = !1, ...s } = a, d = pc(o), m = cl(wg, o), v = m.disabled || r, p = rt(c, m.onTriggerChange), h = gc(o), b = y.useRef("touch"), [E, A, R] = Kg((S) => {
      const C = h().filter((U) => !U.disabled), j = C.find((U) => U.value === m.value), O = kg(C, S, j);
      O !== void 0 && m.onValueChange(O.value);
    }), D = (S) => {
      v || (m.onOpenChange(!0), R()), S && (m.triggerPointerDownPosRef.current = {
        x: Math.round(S.pageX),
        y: Math.round(S.pageY)
      });
    };
    return /* @__PURE__ */ L.jsx(R1, { asChild: !0, ...d, children: /* @__PURE__ */ L.jsx(
      ke.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": m.contentId,
        "aria-expanded": m.open,
        "aria-required": m.required,
        "aria-autocomplete": "none",
        dir: m.dir,
        "data-state": m.open ? "open" : "closed",
        disabled: v,
        "data-disabled": v ? "" : void 0,
        "data-placeholder": Zg(m.value) ? "" : void 0,
        ...s,
        ref: p,
        onClick: Ie(s.onClick, (S) => {
          S.currentTarget.focus(), b.current !== "mouse" && D(S);
        }),
        onPointerDown: Ie(s.onPointerDown, (S) => {
          b.current = S.pointerType;
          const C = S.target;
          C.hasPointerCapture(S.pointerId) && C.releasePointerCapture(S.pointerId), S.button === 0 && S.ctrlKey === !1 && S.pointerType === "mouse" && (D(S), S.preventDefault());
        }),
        onKeyDown: Ie(s.onKeyDown, (S) => {
          const C = E.current !== "";
          !(S.ctrlKey || S.altKey || S.metaKey) && S.key.length === 1 && A(S.key), !(C && S.key === " ") && wx.includes(S.key) && (D(), S.preventDefault());
        })
      }
    ) });
  }
);
Cg.displayName = wg;
var Og = "SelectValue", _g = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, className: r, style: s, children: d, placeholder: m = "", ...v } = a, p = cl(Og, o), { onValueNodeHasChildrenChange: h } = p, b = d !== void 0, E = rt(c, p.onValueNodeChange);
    return bt(() => {
      h(b);
    }, [h, b]), /* @__PURE__ */ L.jsx(
      ke.span,
      {
        ...v,
        ref: E,
        style: { pointerEvents: "none" },
        children: Zg(p.value) ? /* @__PURE__ */ L.jsx(L.Fragment, { children: m }) : d
      }
    );
  }
);
_g.displayName = Og;
var Mx = "SelectIcon", Rg = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, children: r, ...s } = a;
    return /* @__PURE__ */ L.jsx(ke.span, { "aria-hidden": !0, ...s, ref: c, children: r || "▼" });
  }
);
Rg.displayName = Mx;
var Nx = "SelectPortal", zg = (a) => /* @__PURE__ */ L.jsx(mg, { asChild: !0, ...a });
zg.displayName = Nx;
var Dl = "SelectContent", Mg = y.forwardRef(
  (a, c) => {
    const o = cl(Dl, a.__scopeSelect), [r, s] = y.useState();
    if (bt(() => {
      s(new DocumentFragment());
    }, []), !o.open) {
      const d = r;
      return d ? wi.createPortal(
        /* @__PURE__ */ L.jsx(Ng, { scope: a.__scopeSelect, children: /* @__PURE__ */ L.jsx(vc.Slot, { scope: a.__scopeSelect, children: /* @__PURE__ */ L.jsx("div", { children: a.children }) }) }),
        d
      ) : null;
    }
    return /* @__PURE__ */ L.jsx(Dg, { ...a, ref: c });
  }
);
Mg.displayName = Dl;
var Kt = 10, [Ng, ol] = Oa(Dl), Dx = "SelectContentImpl", Ux = /* @__PURE__ */ ac("SelectContent.RemoveScroll"), Dg = y.forwardRef(
  (a, c) => {
    const {
      __scopeSelect: o,
      position: r = "item-aligned",
      onCloseAutoFocus: s,
      onEscapeKeyDown: d,
      onPointerDownOutside: m,
      //
      // PopperContent props
      side: v,
      sideOffset: p,
      align: h,
      alignOffset: b,
      arrowPadding: E,
      collisionBoundary: A,
      collisionPadding: R,
      sticky: D,
      hideWhenDetached: S,
      avoidCollisions: C,
      //
      ...j
    } = a, O = cl(Dl, o), [U, Y] = y.useState(null), [k, I] = y.useState(null), J = rt(c, (F) => Y(F)), [X, ue] = y.useState(null), [me, be] = y.useState(
      null
    ), de = gc(o), [ve, ge] = y.useState(!1), pe = y.useRef(!1);
    y.useEffect(() => {
      if (U) return V1(U);
    }, [U]), iS();
    const V = y.useCallback(
      (F) => {
        const [ce, ...re] = de().map((Ae) => Ae.ref.current), [se] = re.slice(-1), xe = document.activeElement;
        for (const Ae of F)
          if (Ae === xe || (Ae == null || Ae.scrollIntoView({ block: "nearest" }), Ae === ce && k && (k.scrollTop = 0), Ae === se && k && (k.scrollTop = k.scrollHeight), Ae == null || Ae.focus(), document.activeElement !== xe)) return;
      },
      [de, k]
    ), B = y.useCallback(
      () => V([X, U]),
      [V, X, U]
    );
    y.useEffect(() => {
      ve && B();
    }, [ve, B]);
    const { onOpenChange: G, triggerPointerDownPosRef: le } = O;
    y.useEffect(() => {
      if (U) {
        let F = { x: 0, y: 0 };
        const ce = (se) => {
          var xe, Ae;
          F = {
            x: Math.abs(Math.round(se.pageX) - (((xe = le.current) == null ? void 0 : xe.x) ?? 0)),
            y: Math.abs(Math.round(se.pageY) - (((Ae = le.current) == null ? void 0 : Ae.y) ?? 0))
          };
        }, re = (se) => {
          F.x <= 10 && F.y <= 10 ? se.preventDefault() : U.contains(se.target) || G(!1), document.removeEventListener("pointermove", ce), le.current = null;
        };
        return le.current !== null && (document.addEventListener("pointermove", ce), document.addEventListener("pointerup", re, { capture: !0, once: !0 })), () => {
          document.removeEventListener("pointermove", ce), document.removeEventListener("pointerup", re, { capture: !0 });
        };
      }
    }, [U, G, le]), y.useEffect(() => {
      const F = () => G(!1);
      return window.addEventListener("blur", F), window.addEventListener("resize", F), () => {
        window.removeEventListener("blur", F), window.removeEventListener("resize", F);
      };
    }, [G]);
    const [W, Be] = Kg((F) => {
      const ce = de().filter((xe) => !xe.disabled), re = ce.find((xe) => xe.ref.current === document.activeElement), se = kg(ce, F, re);
      se && setTimeout(() => se.ref.current.focus());
    }), T = y.useCallback(
      (F, ce, re) => {
        const se = !pe.current && !re;
        (O.value !== void 0 && O.value === ce || se) && (ue(F), se && (pe.current = !0));
      },
      [O.value]
    ), Q = y.useCallback(() => U == null ? void 0 : U.focus(), [U]), $ = y.useCallback(
      (F, ce, re) => {
        const se = !pe.current && !re;
        (O.value !== void 0 && O.value === ce || se) && be(F);
      },
      [O.value]
    ), P = r === "popper" ? us : Ug, ae = P === us ? {
      side: v,
      sideOffset: p,
      align: h,
      alignOffset: b,
      arrowPadding: E,
      collisionBoundary: A,
      collisionPadding: R,
      sticky: D,
      hideWhenDetached: S,
      avoidCollisions: C
    } : {};
    return /* @__PURE__ */ L.jsx(
      Ng,
      {
        scope: o,
        content: U,
        viewport: k,
        onViewportChange: I,
        itemRefCallback: T,
        selectedItem: X,
        onItemLeave: Q,
        itemTextRefCallback: $,
        focusSelectedItem: B,
        selectedItemText: me,
        position: r,
        isPositioned: ve,
        searchRef: W,
        children: /* @__PURE__ */ L.jsx(Ag, { as: Ux, allowPinchZoom: !0, children: /* @__PURE__ */ L.jsx(
          Xv,
          {
            asChild: !0,
            trapped: O.open,
            onMountAutoFocus: (F) => {
              F.preventDefault();
            },
            onUnmountAutoFocus: Ie(s, (F) => {
              var ce;
              (ce = O.trigger) == null || ce.focus({ preventScroll: !0 }), F.preventDefault();
            }),
            children: /* @__PURE__ */ L.jsx(
              Gv,
              {
                asChild: !0,
                disableOutsidePointerEvents: !0,
                onEscapeKeyDown: d,
                onPointerDownOutside: m,
                onFocusOutside: (F) => F.preventDefault(),
                onDismiss: () => O.onOpenChange(!1),
                children: /* @__PURE__ */ L.jsx(
                  P,
                  {
                    role: "listbox",
                    id: O.contentId,
                    "data-state": O.open ? "open" : "closed",
                    dir: O.dir,
                    onContextMenu: (F) => F.preventDefault(),
                    ...j,
                    ...ae,
                    onPlaced: () => ge(!0),
                    ref: J,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...j.style
                    },
                    onKeyDown: Ie(j.onKeyDown, (F) => {
                      const ce = F.ctrlKey || F.altKey || F.metaKey;
                      if (F.key === "Tab" && F.preventDefault(), !ce && F.key.length === 1 && Be(F.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(F.key)) {
                        let se = de().filter((xe) => !xe.disabled).map((xe) => xe.ref.current);
                        if (["ArrowUp", "End"].includes(F.key) && (se = se.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(F.key)) {
                          const xe = F.target, Ae = se.indexOf(xe);
                          se = se.slice(Ae + 1);
                        }
                        setTimeout(() => V(se)), F.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
Dg.displayName = Dx;
var jx = "SelectItemAlignedPosition", Ug = y.forwardRef((a, c) => {
  const { __scopeSelect: o, onPlaced: r, ...s } = a, d = cl(Dl, o), m = ol(Dl, o), [v, p] = y.useState(null), [h, b] = y.useState(null), E = rt(c, (J) => b(J)), A = gc(o), R = y.useRef(!1), D = y.useRef(!0), { viewport: S, selectedItem: C, selectedItemText: j, focusSelectedItem: O } = m, U = y.useCallback(() => {
    if (d.trigger && d.valueNode && v && h && S && C && j) {
      const J = d.trigger.getBoundingClientRect(), X = h.getBoundingClientRect(), ue = d.valueNode.getBoundingClientRect(), me = j.getBoundingClientRect();
      if (d.dir !== "rtl") {
        const xe = me.left - X.left, Ae = ue.left - xe, Qe = J.left - Ae, tt = J.width + Qe, St = Math.max(tt, X.width), an = window.innerWidth - Kt, un = kh(Ae, [
          Kt,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(Kt, an - St)
        ]);
        v.style.minWidth = tt + "px", v.style.left = un + "px";
      } else {
        const xe = X.right - me.right, Ae = window.innerWidth - ue.right - xe, Qe = window.innerWidth - J.right - Ae, tt = J.width + Qe, St = Math.max(tt, X.width), an = window.innerWidth - Kt, un = kh(Ae, [
          Kt,
          Math.max(Kt, an - St)
        ]);
        v.style.minWidth = tt + "px", v.style.right = un + "px";
      }
      const be = A(), de = window.innerHeight - Kt * 2, ve = S.scrollHeight, ge = window.getComputedStyle(h), pe = parseInt(ge.borderTopWidth, 10), V = parseInt(ge.paddingTop, 10), B = parseInt(ge.borderBottomWidth, 10), G = parseInt(ge.paddingBottom, 10), le = pe + V + ve + G + B, W = Math.min(C.offsetHeight * 5, le), Be = window.getComputedStyle(S), T = parseInt(Be.paddingTop, 10), Q = parseInt(Be.paddingBottom, 10), $ = J.top + J.height / 2 - Kt, P = de - $, ae = C.offsetHeight / 2, F = C.offsetTop + ae, ce = pe + V + F, re = le - ce;
      if (ce <= $) {
        const xe = be.length > 0 && C === be[be.length - 1].ref.current;
        v.style.bottom = "0px";
        const Ae = h.clientHeight - S.offsetTop - S.offsetHeight, Qe = Math.max(
          P,
          ae + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (xe ? Q : 0) + Ae + B
        ), tt = ce + Qe;
        v.style.height = tt + "px";
      } else {
        const xe = be.length > 0 && C === be[0].ref.current;
        v.style.top = "0px";
        const Qe = Math.max(
          $,
          pe + S.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (xe ? T : 0) + ae
        ) + re;
        v.style.height = Qe + "px", S.scrollTop = ce - $ + S.offsetTop;
      }
      v.style.margin = `${Kt}px 0`, v.style.minHeight = W + "px", v.style.maxHeight = de + "px", r == null || r(), requestAnimationFrame(() => R.current = !0);
    }
  }, [
    A,
    d.trigger,
    d.valueNode,
    v,
    h,
    S,
    C,
    j,
    d.dir,
    r
  ]);
  bt(() => U(), [U]);
  const [Y, k] = y.useState();
  bt(() => {
    h && k(window.getComputedStyle(h).zIndex);
  }, [h]);
  const I = y.useCallback(
    (J) => {
      J && D.current === !0 && (U(), O == null || O(), D.current = !1);
    },
    [U, O]
  );
  return /* @__PURE__ */ L.jsx(
    Lx,
    {
      scope: o,
      contentWrapper: v,
      shouldExpandOnScrollRef: R,
      onScrollButtonChange: I,
      children: /* @__PURE__ */ L.jsx(
        "div",
        {
          ref: p,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: Y
          },
          children: /* @__PURE__ */ L.jsx(
            ke.div,
            {
              ...s,
              ref: E,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...s.style
              }
            }
          )
        }
      )
    }
  );
});
Ug.displayName = jx;
var Hx = "SelectPopperPosition", us = y.forwardRef((a, c) => {
  const {
    __scopeSelect: o,
    align: r = "start",
    collisionPadding: s = Kt,
    ...d
  } = a, m = pc(o);
  return /* @__PURE__ */ L.jsx(
    z1,
    {
      ...m,
      ...d,
      ref: c,
      align: r,
      collisionPadding: s,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...d.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
us.displayName = Hx;
var [Lx, Cs] = Oa(Dl, {}), cs = "SelectViewport", jg = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, nonce: r, ...s } = a, d = ol(cs, o), m = Cs(cs, o), v = rt(c, d.onViewportChange), p = y.useRef(0);
    return /* @__PURE__ */ L.jsxs(L.Fragment, { children: [
      /* @__PURE__ */ L.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: r
        }
      ),
      /* @__PURE__ */ L.jsx(vc.Slot, { scope: o, children: /* @__PURE__ */ L.jsx(
        ke.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...s,
          ref: v,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...s.style
          },
          onScroll: Ie(s.onScroll, (h) => {
            const b = h.currentTarget, { contentWrapper: E, shouldExpandOnScrollRef: A } = m;
            if (A != null && A.current && E) {
              const R = Math.abs(p.current - b.scrollTop);
              if (R > 0) {
                const D = window.innerHeight - Kt * 2, S = parseFloat(E.style.minHeight), C = parseFloat(E.style.height), j = Math.max(S, C);
                if (j < D) {
                  const O = j + R, U = Math.min(D, O), Y = O - U;
                  E.style.height = U + "px", E.style.bottom === "0px" && (b.scrollTop = Y > 0 ? Y : 0, E.style.justifyContent = "flex-end");
                }
              }
            }
            p.current = b.scrollTop;
          })
        }
      ) })
    ] });
  }
);
jg.displayName = cs;
var Hg = "SelectGroup", [Bx, Yx] = Oa(Hg), qx = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, ...r } = a, s = ps();
    return /* @__PURE__ */ L.jsx(Bx, { scope: o, id: s, children: /* @__PURE__ */ L.jsx(ke.div, { role: "group", "aria-labelledby": s, ...r, ref: c }) });
  }
);
qx.displayName = Hg;
var Lg = "SelectLabel", Gx = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, ...r } = a, s = Yx(Lg, o);
    return /* @__PURE__ */ L.jsx(ke.div, { id: s.id, ...r, ref: c });
  }
);
Gx.displayName = Lg;
var rc = "SelectItem", [Vx, Bg] = Oa(rc), Yg = y.forwardRef(
  (a, c) => {
    const {
      __scopeSelect: o,
      value: r,
      disabled: s = !1,
      textValue: d,
      ...m
    } = a, v = cl(rc, o), p = ol(rc, o), h = v.value === r, [b, E] = y.useState(d ?? ""), [A, R] = y.useState(!1), D = rt(
      c,
      (O) => {
        var U;
        return (U = p.itemRefCallback) == null ? void 0 : U.call(p, O, r, s);
      }
    ), S = ps(), C = y.useRef("touch"), j = () => {
      s || (v.onValueChange(r), v.onOpenChange(!1));
    };
    if (r === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return /* @__PURE__ */ L.jsx(
      Vx,
      {
        scope: o,
        value: r,
        disabled: s,
        textId: S,
        isSelected: h,
        onItemTextChange: y.useCallback((O) => {
          E((U) => U || ((O == null ? void 0 : O.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ L.jsx(
          vc.ItemSlot,
          {
            scope: o,
            value: r,
            disabled: s,
            textValue: b,
            children: /* @__PURE__ */ L.jsx(
              ke.div,
              {
                role: "option",
                "aria-labelledby": S,
                "data-highlighted": A ? "" : void 0,
                "aria-selected": h && A,
                "data-state": h ? "checked" : "unchecked",
                "aria-disabled": s || void 0,
                "data-disabled": s ? "" : void 0,
                tabIndex: s ? void 0 : -1,
                ...m,
                ref: D,
                onFocus: Ie(m.onFocus, () => R(!0)),
                onBlur: Ie(m.onBlur, () => R(!1)),
                onClick: Ie(m.onClick, () => {
                  C.current !== "mouse" && j();
                }),
                onPointerUp: Ie(m.onPointerUp, () => {
                  C.current === "mouse" && j();
                }),
                onPointerDown: Ie(m.onPointerDown, (O) => {
                  C.current = O.pointerType;
                }),
                onPointerMove: Ie(m.onPointerMove, (O) => {
                  var U;
                  C.current = O.pointerType, s ? (U = p.onItemLeave) == null || U.call(p) : C.current === "mouse" && O.currentTarget.focus({ preventScroll: !0 });
                }),
                onPointerLeave: Ie(m.onPointerLeave, (O) => {
                  var U;
                  O.currentTarget === document.activeElement && ((U = p.onItemLeave) == null || U.call(p));
                }),
                onKeyDown: Ie(m.onKeyDown, (O) => {
                  var Y;
                  ((Y = p.searchRef) == null ? void 0 : Y.current) !== "" && O.key === " " || (Cx.includes(O.key) && j(), O.key === " " && O.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }
);
Yg.displayName = rc;
var Ai = "SelectItemText", qg = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, className: r, style: s, ...d } = a, m = cl(Ai, o), v = ol(Ai, o), p = Bg(Ai, o), h = zx(Ai, o), [b, E] = y.useState(null), A = rt(
      c,
      (j) => E(j),
      p.onItemTextChange,
      (j) => {
        var O;
        return (O = v.itemTextRefCallback) == null ? void 0 : O.call(v, j, p.value, p.disabled);
      }
    ), R = b == null ? void 0 : b.textContent, D = y.useMemo(
      () => /* @__PURE__ */ L.jsx("option", { value: p.value, disabled: p.disabled, children: R }, p.value),
      [p.disabled, p.value, R]
    ), { onNativeOptionAdd: S, onNativeOptionRemove: C } = h;
    return bt(() => (S(D), () => C(D)), [S, C, D]), /* @__PURE__ */ L.jsxs(L.Fragment, { children: [
      /* @__PURE__ */ L.jsx(ke.span, { id: p.textId, ...d, ref: A }),
      p.isSelected && m.valueNode && !m.valueNodeHasChildren ? wi.createPortal(d.children, m.valueNode) : null
    ] });
  }
);
qg.displayName = Ai;
var Gg = "SelectItemIndicator", Vg = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, ...r } = a;
    return Bg(Gg, o).isSelected ? /* @__PURE__ */ L.jsx(ke.span, { "aria-hidden": !0, ...r, ref: c }) : null;
  }
);
Vg.displayName = Gg;
var os = "SelectScrollUpButton", Xx = y.forwardRef((a, c) => {
  const o = ol(os, a.__scopeSelect), r = Cs(os, a.__scopeSelect), [s, d] = y.useState(!1), m = rt(c, r.onScrollButtonChange);
  return bt(() => {
    if (o.viewport && o.isPositioned) {
      let v = function() {
        const h = p.scrollTop > 0;
        d(h);
      };
      const p = o.viewport;
      return v(), p.addEventListener("scroll", v), () => p.removeEventListener("scroll", v);
    }
  }, [o.viewport, o.isPositioned]), s ? /* @__PURE__ */ L.jsx(
    Xg,
    {
      ...a,
      ref: m,
      onAutoScroll: () => {
        const { viewport: v, selectedItem: p } = o;
        v && p && (v.scrollTop = v.scrollTop - p.offsetHeight);
      }
    }
  ) : null;
});
Xx.displayName = os;
var rs = "SelectScrollDownButton", Qx = y.forwardRef((a, c) => {
  const o = ol(rs, a.__scopeSelect), r = Cs(rs, a.__scopeSelect), [s, d] = y.useState(!1), m = rt(c, r.onScrollButtonChange);
  return bt(() => {
    if (o.viewport && o.isPositioned) {
      let v = function() {
        const h = p.scrollHeight - p.clientHeight, b = Math.ceil(p.scrollTop) < h;
        d(b);
      };
      const p = o.viewport;
      return v(), p.addEventListener("scroll", v), () => p.removeEventListener("scroll", v);
    }
  }, [o.viewport, o.isPositioned]), s ? /* @__PURE__ */ L.jsx(
    Xg,
    {
      ...a,
      ref: m,
      onAutoScroll: () => {
        const { viewport: v, selectedItem: p } = o;
        v && p && (v.scrollTop = v.scrollTop + p.offsetHeight);
      }
    }
  ) : null;
});
Qx.displayName = rs;
var Xg = y.forwardRef((a, c) => {
  const { __scopeSelect: o, onAutoScroll: r, ...s } = a, d = ol("SelectScrollButton", o), m = y.useRef(null), v = gc(o), p = y.useCallback(() => {
    m.current !== null && (window.clearInterval(m.current), m.current = null);
  }, []);
  return y.useEffect(() => () => p(), [p]), bt(() => {
    var b;
    const h = v().find((E) => E.ref.current === document.activeElement);
    (b = h == null ? void 0 : h.ref.current) == null || b.scrollIntoView({ block: "nearest" });
  }, [v]), /* @__PURE__ */ L.jsx(
    ke.div,
    {
      "aria-hidden": !0,
      ...s,
      ref: c,
      style: { flexShrink: 0, ...s.style },
      onPointerDown: Ie(s.onPointerDown, () => {
        m.current === null && (m.current = window.setInterval(r, 50));
      }),
      onPointerMove: Ie(s.onPointerMove, () => {
        var h;
        (h = d.onItemLeave) == null || h.call(d), m.current === null && (m.current = window.setInterval(r, 50));
      }),
      onPointerLeave: Ie(s.onPointerLeave, () => {
        p();
      })
    }
  );
}), Zx = "SelectSeparator", Kx = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, ...r } = a;
    return /* @__PURE__ */ L.jsx(ke.div, { "aria-hidden": !0, ...r, ref: c });
  }
);
Kx.displayName = Zx;
var ss = "SelectArrow", kx = y.forwardRef(
  (a, c) => {
    const { __scopeSelect: o, ...r } = a, s = pc(o), d = cl(ss, o), m = ol(ss, o);
    return d.open && m.position === "popper" ? /* @__PURE__ */ L.jsx(M1, { ...s, ...r, ref: c }) : null;
  }
);
kx.displayName = ss;
var Jx = "SelectBubbleInput", Qg = y.forwardRef(
  ({ __scopeSelect: a, value: c, ...o }, r) => {
    const s = y.useRef(null), d = rt(r, s), m = H1(c);
    return y.useEffect(() => {
      const v = s.current;
      if (!v) return;
      const p = window.HTMLSelectElement.prototype, b = Object.getOwnPropertyDescriptor(
        p,
        "value"
      ).set;
      if (m !== c && b) {
        const E = new Event("change", { bubbles: !0 });
        b.call(v, c), v.dispatchEvent(E);
      }
    }, [m, c]), /* @__PURE__ */ L.jsx(
      ke.select,
      {
        ...o,
        style: { ...hg, ...o.style },
        ref: d,
        defaultValue: c
      }
    );
  }
);
Qg.displayName = Jx;
function Zg(a) {
  return a === "" || a === void 0;
}
function Kg(a) {
  const c = zl(a), o = y.useRef(""), r = y.useRef(0), s = y.useCallback(
    (m) => {
      const v = o.current + m;
      c(v), (function p(h) {
        o.current = h, window.clearTimeout(r.current), h !== "" && (r.current = window.setTimeout(() => p(""), 1e3));
      })(v);
    },
    [c]
  ), d = y.useCallback(() => {
    o.current = "", window.clearTimeout(r.current);
  }, []);
  return y.useEffect(() => () => window.clearTimeout(r.current), []), [o, s, d];
}
function kg(a, c, o) {
  const s = c.length > 1 && Array.from(c).every((h) => h === c[0]) ? c[0] : c, d = o ? a.indexOf(o) : -1;
  let m = Wx(a, Math.max(d, 0));
  s.length === 1 && (m = m.filter((h) => h !== o));
  const p = m.find(
    (h) => h.textValue.toLowerCase().startsWith(s.toLowerCase())
  );
  return p !== o ? p : void 0;
}
function Wx(a, c) {
  return a.map((o, r) => a[(c + r) % a.length]);
}
var $x = Tg, Jg = Cg, Fx = _g, Ix = Rg, Px = zg, Wg = Mg, eE = jg, $g = Yg, tE = qg, nE = Vg;
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fg = (...a) => a.filter((c, o, r) => !!c && c.trim() !== "" && r.indexOf(c) === o).join(" ").trim();
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lE = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const aE = (a) => a.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (c, o, r) => r ? r.toUpperCase() : o.toLowerCase()
);
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yv = (a) => {
  const c = aE(a);
  return c.charAt(0).toUpperCase() + c.slice(1);
};
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Ir = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iE = (a) => {
  for (const c in a)
    if (c.startsWith("aria-") || c === "role" || c === "title")
      return !0;
  return !1;
}, uE = y.createContext({}), cE = () => y.useContext(uE), oE = y.forwardRef(
  ({ color: a, size: c, strokeWidth: o, absoluteStrokeWidth: r, className: s = "", children: d, iconNode: m, ...v }, p) => {
    const {
      size: h = 24,
      strokeWidth: b = 2,
      absoluteStrokeWidth: E = !1,
      color: A = "currentColor",
      className: R = ""
    } = cE() ?? {}, D = r ?? E ? Number(o ?? b) * 24 / Number(c ?? h) : o ?? b;
    return y.createElement(
      "svg",
      {
        ref: p,
        ...Ir,
        width: c ?? h ?? Ir.width,
        height: c ?? h ?? Ir.height,
        stroke: a ?? A,
        strokeWidth: D,
        className: Fg("lucide", R, s),
        ...!d && !iE(v) && { "aria-hidden": "true" },
        ...v
      },
      [
        ...m.map(([S, C]) => y.createElement(S, C)),
        ...Array.isArray(d) ? d : [d]
      ]
    );
  }
);
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Oi = (a, c) => {
  const o = y.forwardRef(
    ({ className: r, ...s }, d) => y.createElement(oE, {
      ref: d,
      iconNode: c,
      className: Fg(
        `lucide-${lE(yv(a))}`,
        `lucide-${a}`,
        r
      ),
      ...s
    })
  );
  return o.displayName = yv(a), o;
};
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rE = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], sE = Oi("check", rE);
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fE = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], dE = Oi("chevron-down", fE);
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mE = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], hE = Oi("loader-circle", mE);
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vE = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], gE = Oi("plus", vE);
/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pE = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], yE = Oi("x", pE), bE = $x, SE = Fx, Ig = y.forwardRef(({ className: a, children: c, ...o }, r) => /* @__PURE__ */ L.jsxs(
  Jg,
  {
    ref: r,
    className: nn(
      "flex h-8 w-full items-center justify-between rounded-none border border-input bg-background px-2.5 py-1 text-xs transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:text-left",
      a
    ),
    ...o,
    children: [
      c,
      /* @__PURE__ */ L.jsx(Ix, { asChild: !0, children: /* @__PURE__ */ L.jsx(dE, { className: "size-3.5 opacity-50" }) })
    ]
  }
));
Ig.displayName = Jg.displayName;
const Pg = y.forwardRef(({ className: a, children: c, position: o = "popper", container: r, ...s }, d) => /* @__PURE__ */ L.jsx(Px, { container: r ?? void 0, children: /* @__PURE__ */ L.jsx(
  Wg,
  {
    ref: d,
    className: nn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 overflow-hidden rounded-none border border-border bg-popover text-popover-foreground shadow-none",
      o === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
      a
    ),
    position: o,
    ...s,
    children: /* @__PURE__ */ L.jsx(
      eE,
      {
        className: nn(
          "p-1",
          o === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        ),
        children: c
      }
    )
  }
) }));
Pg.displayName = Wg.displayName;
const ep = y.forwardRef(({ className: a, children: c, ...o }, r) => /* @__PURE__ */ L.jsxs(
  $g,
  {
    ref: r,
    className: nn(
      "relative flex w-full cursor-default select-none items-center rounded-none py-1 pl-6 pr-2 text-xs outline-none focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      a
    ),
    ...o,
    children: [
      /* @__PURE__ */ L.jsx("span", { className: "absolute left-1 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ L.jsx(nE, { children: /* @__PURE__ */ L.jsx(sE, { className: "size-3.5" }) }) }),
      /* @__PURE__ */ L.jsx(tE, { children: c })
    ]
  }
));
ep.displayName = $g.displayName;
function xE({ layout: a, aspectRatio: c, panelLabel: o }) {
  const { rows: r, cols: s } = Lv(a), d = r * s, m = y.useMemo(() => Array.from({ length: d }, (h, b) => b + 1), [d]), v = y.useMemo(() => {
    const [h, b] = c.split(":").map(Number);
    return { aspectRatio: `${h} / ${b}` };
  }, [c]), p = y.useMemo(
    () => ({
      gridTemplateColumns: `repeat(${s}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${r}, minmax(0, 1fr))`
    }),
    [r, s]
  );
  return /* @__PURE__ */ L.jsx("div", { className: "flex w-full items-center justify-center", children: /* @__PURE__ */ L.jsx(
    "div",
    {
      className: "relative w-full max-w-md border border-border bg-muted/30",
      style: v,
      children: /* @__PURE__ */ L.jsx("div", { className: "absolute inset-0 grid gap-px bg-border p-px", style: p, children: m.map((h) => /* @__PURE__ */ L.jsx(
        "div",
        {
          className: nn(
            "flex items-center justify-center bg-background text-muted-foreground",
            "select-none"
          ),
          children: /* @__PURE__ */ L.jsxs("span", { className: "text-xs font-medium", children: [
            o,
            " ",
            h
          ] })
        },
        h
      )) })
    }
  ) });
}
function EE({
  sdk: a,
  images: c,
  onChange: o,
  disabled: r,
  addLabel: s,
  removeLabel: d,
  uploadFailedLabel: m
}) {
  const v = y.useRef(null), [p, h] = y.useState(!1), [b, E] = y.useState(null), A = c.length < Xh && !r && !p, R = () => {
    var C;
    A && ((C = v.current) == null || C.click());
  }, D = async (C) => {
    if (!(!C || C.length === 0)) {
      E(null), h(!0);
      try {
        const j = Xh - c.length, O = Array.from(C).slice(0, j), U = await Promise.all(
          O.map((Y) => a.uploadFile(Y, { fileType: "image" }))
        );
        o([...c, ...U.map((Y) => Y.url)]);
      } catch {
        E(m);
      } finally {
        h(!1), v.current && (v.current.value = "");
      }
    }
  }, S = (C) => {
    r || o(c.filter((j, O) => O !== C));
  };
  return /* @__PURE__ */ L.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ L.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      c.map((C, j) => /* @__PURE__ */ L.jsxs(
        "div",
        {
          className: "group relative h-16 w-16 overflow-hidden border border-border bg-muted",
          children: [
            /* @__PURE__ */ L.jsx(
              "img",
              {
                src: C,
                alt: "",
                className: "h-full w-full object-cover",
                draggable: !1
              }
            ),
            !r && /* @__PURE__ */ L.jsx(
              "button",
              {
                type: "button",
                onClick: () => S(j),
                "aria-label": d,
                className: "absolute right-0 top-0 flex size-4 items-center justify-center bg-foreground/80 text-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none",
                children: /* @__PURE__ */ L.jsx(yE, { className: "size-3" })
              }
            )
          ]
        },
        `${C}-${j}`
      )),
      A && /* @__PURE__ */ L.jsx(
        "button",
        {
          type: "button",
          onClick: R,
          "aria-label": s,
          className: nn(
            "flex h-16 w-16 items-center justify-center border border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          ),
          children: p ? /* @__PURE__ */ L.jsx(hE, { className: "size-4 animate-spin" }) : /* @__PURE__ */ L.jsx(gE, { className: "size-4" })
        }
      )
    ] }),
    /* @__PURE__ */ L.jsx(
      "input",
      {
        ref: v,
        type: "file",
        accept: "image/*",
        multiple: !0,
        className: "hidden",
        onChange: (C) => D(C.target.files)
      }
    ),
    b && /* @__PURE__ */ L.jsx("p", { className: "text-xs text-destructive", children: b })
  ] });
}
function AE({ progress: a, message: c, label: o }) {
  const r = Math.max(0, Math.min(100, Math.round(a)));
  return /* @__PURE__ */ L.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ L.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ L.jsx("span", { children: c ?? o }),
      /* @__PURE__ */ L.jsxs("span", { children: [
        r,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ L.jsx("div", { className: "h-1 w-full overflow-hidden bg-muted", children: /* @__PURE__ */ L.jsx(
      "div",
      {
        className: nn("h-full bg-foreground transition-[width] duration-200"),
        style: { width: `${r}%` }
      }
    ) })
  ] });
}
function TE({
  sdk: a,
  values: c,
  onChange: o,
  onGenerate: r,
  onReset: s,
  status: d,
  progress: m,
  progressMessage: v,
  portalContainer: p
}) {
  const h = Ub(O0, a.locale), b = d !== "idle", E = y.useMemo(
    () => c.prompt.trim().length > 0 && !b,
    [c.prompt, b]
  ), A = y.useMemo(
    () => c.gridLayout === nc.gridLayout && c.aspectRatio === nc.aspectRatio && c.referenceImages.length === 0 && c.prompt === "",
    [c]
  ), R = (O) => o({ ...c, gridLayout: O }), D = (O) => o({ ...c, aspectRatio: O }), S = (O) => o({ ...c, referenceImages: O }), C = (O) => o({ ...c, prompt: O }), j = d === "uploading" ? h.uploadingButton : d === "generating" ? h.generatingButton : h.generateButton;
  return /* @__PURE__ */ L.jsxs("div", { className: "flex h-full min-h-0 flex-col gap-4 p-4", children: [
    /* @__PURE__ */ L.jsx("h2", { className: "text-sm font-heading font-semibold text-foreground", children: h.title }),
    /* @__PURE__ */ L.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ L.jsx(
        xE,
        {
          layout: c.gridLayout,
          aspectRatio: c.aspectRatio,
          panelLabel: h.panelLabel
        }
      ),
      /* @__PURE__ */ L.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ L.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ L.jsx("span", { className: "text-xs text-muted-foreground", children: h.gridLayoutLabel }),
          /* @__PURE__ */ L.jsx("div", { className: "flex items-center gap-1", children: w0.map((O) => {
            const U = c.gridLayout === O;
            return /* @__PURE__ */ L.jsx(
              "button",
              {
                type: "button",
                disabled: b,
                onClick: () => R(O),
                className: nn(
                  "h-7 rounded-none border border-border px-2 text-xs transition-colors",
                  "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                  U ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                  "disabled:opacity-50 disabled:pointer-events-none"
                ),
                children: O
              },
              O
            );
          }) })
        ] }),
        /* @__PURE__ */ L.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ L.jsx("span", { className: "text-xs text-muted-foreground", children: h.aspectRatioLabel }),
          /* @__PURE__ */ L.jsxs(
            bE,
            {
              value: c.aspectRatio,
              onValueChange: (O) => D(O),
              disabled: b,
              children: [
                /* @__PURE__ */ L.jsx(Ig, { className: "h-7 w-24", children: /* @__PURE__ */ L.jsx(SE, {}) }),
                /* @__PURE__ */ L.jsx(Pg, { container: p, children: C0.map((O) => /* @__PURE__ */ L.jsx(ep, { value: O, children: O }, O)) })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ L.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ L.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ L.jsx("label", { className: "text-xs text-foreground", children: h.referenceImagesLabel }),
        /* @__PURE__ */ L.jsx("span", { className: "text-xs text-muted-foreground", children: h.referenceImagesHint })
      ] }),
      /* @__PURE__ */ L.jsx(
        EE,
        {
          sdk: a,
          images: c.referenceImages,
          onChange: S,
          disabled: b,
          addLabel: h.addImage,
          removeLabel: h.removeImage,
          uploadFailedLabel: h.uploadFailed
        }
      )
    ] }),
    /* @__PURE__ */ L.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ L.jsx("label", { htmlFor: "storyboard-prompt", className: "text-xs text-foreground", children: h.promptLabel }),
      /* @__PURE__ */ L.jsx(
        Yv,
        {
          id: "storyboard-prompt",
          value: c.prompt,
          onChange: (O) => C(O.target.value),
          placeholder: h.promptPlaceholder,
          disabled: b,
          rows: 4,
          className: "min-h-20"
        }
      )
    ] }),
    d === "generating" && /* @__PURE__ */ L.jsx(AE, { progress: m, message: v, label: h.progressLabel }),
    /* @__PURE__ */ L.jsxs("div", { className: "mt-auto flex items-center justify-between gap-2 pt-2", children: [
      /* @__PURE__ */ L.jsx(
        es,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: s,
          disabled: b || A,
          children: h.resetButton
        }
      ),
      /* @__PURE__ */ L.jsx(
        es,
        {
          type: "button",
          variant: "default",
          size: "default",
          onClick: r,
          disabled: !E,
          children: j
        }
      )
    ] })
  ] });
}
function wE({ sdk: a }) {
  const c = y.useRef(null), [o, r] = y.useState(null), [s, d] = y.useState(nc), [m, v] = y.useState("idle"), [p, h] = y.useState(0), [b, E] = y.useState(void 0);
  y.useEffect(() => {
    r(c.current);
  }, []), y.useEffect(() => {
    var D;
    (D = a.emit) == null || D.call(a, "gui:ready", {});
  }, [a]), y.useEffect(() => {
    var S;
    const D = (S = a.on) == null ? void 0 : S.call(a, "params:inject", (C) => {
      !C || typeof C != "object" || d((j) => {
        const O = { ...j }, U = C;
        if (typeof U.gridLayout == "string" && /^(2x2|3x3|4x4)$/.test(U.gridLayout) && (O.gridLayout = U.gridLayout), typeof U.aspectRatio == "string" && ["16:9", "4:3", "1:1", "3:4", "9:16"].includes(U.aspectRatio) && (O.aspectRatio = U.aspectRatio), typeof U.prompt == "string" && (O.prompt = U.prompt), typeof U.user_prompt == "string" && (O.prompt = U.user_prompt), typeof U.aspect_ratio == "string" && ["16:9", "4:3", "1:1", "3:4", "9:16"].includes(U.aspect_ratio) && (O.aspectRatio = U.aspect_ratio), Array.isArray(U.referenceImages))
          O.referenceImages = U.referenceImages.filter((Y) => typeof Y == "string" && Y.length > 0).slice(0, 4);
        else {
          const Y = [];
          for (let k = 1; k <= 4; k++) {
            const I = U[`reference_image_${k}`];
            typeof I == "string" && I.length > 0 && Y.push(I);
          }
          Y.length > 0 && (O.referenceImages = Y);
        }
        return O;
      });
    });
    return () => D == null ? void 0 : D();
  }, [a]), y.useEffect(() => {
    var j, O, U;
    const D = (j = a.on) == null ? void 0 : j.call(a, "generate:start", () => {
      v("generating"), h(0), E(void 0);
    }), S = (O = a.on) == null ? void 0 : O.call(
      a,
      "generate:progress",
      ({ progress: Y, message: k }) => {
        typeof Y == "number" && h(Y), typeof k == "string" && E(k);
      }
    ), C = (U = a.on) == null ? void 0 : U.call(a, "generate:result", () => {
      v("idle"), h(0), E(void 0);
    });
    return () => {
      D == null || D(), S == null || S(), C == null || C();
    };
  }, [a]);
  const A = () => {
    var S, C;
    if (m !== "idle" || !s.prompt.trim()) return;
    const D = T0(s);
    v("uploading"), (S = a.emit) == null || S.call(a, "generate:submit", { params: D }), (C = a.track) == null || C.call(a, "storyboard_generate_submit", {
      gridLayout: s.gridLayout,
      aspectRatio: s.aspectRatio,
      reference_count: s.referenceImages.length
    });
  }, R = () => {
    m === "idle" && (d(nc), h(0), E(void 0));
  };
  return /* @__PURE__ */ L.jsx("div", { ref: c, "data-remote-tool": !0, className: "flex h-full flex-col bg-background", children: /* @__PURE__ */ L.jsx("div", { className: "flex min-h-0 flex-1 flex-col overflow-y-auto", children: /* @__PURE__ */ L.jsx(
    TE,
    {
      sdk: a,
      values: s,
      onChange: d,
      onGenerate: A,
      onReset: R,
      status: m,
      progress: p,
      progressMessage: b,
      portalContainer: o
    }
  ) }) });
}
const CE = Db(wE);
export {
  CE as mount
};
