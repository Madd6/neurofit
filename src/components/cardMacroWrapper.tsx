import React from 'react'
import CardMacro from './CardMacro'
import { auth } from '@/auth';
import { getMakronutrisi } from '@/action/supabaseFunc';
import { OneShotToast } from './OneShootToast';

const CardMacroWrapper = async() => {
    const session = await auth()
    const userId = session?.user.id;
    const resMacro = await getMakronutrisi(userId!);
    if(!resMacro.success || !resMacro.data){
    <OneShotToast message={resMacro.msg || "Gagal mengambil data Makronutrisi"} />
    }
    const macro = resMacro.data
  return (
    <div>
      <CardMacro
          tdee={macro?.[0]?.tdee ?? null}
          rmr={macro?.[0]?.rmr ?? null}
          targetKalori={macro?.[0]?.targetKalori ?? null}
          protein={macro?.[0]?.protein ?? null}
          lemak={macro?.[0]?.lemak ?? null}
          karbohidrat={macro?.[0]?.karbohidrat ?? null}
        />
    </div>
  )
}

export default CardMacroWrapper
