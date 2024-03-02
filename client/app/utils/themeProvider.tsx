'use client'

import * as React from 'react'
import type { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemeProvider} from "next-themes";

// export function ThemeProvider({childern, ...props}):ThemeProviderProps){
//     return <NextThemeProvider {...props}>{children}</NextThemeProvider>
// }

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: React.ReactNode }) {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
