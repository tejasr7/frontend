// Create a file named desmos.d.ts in your project's types directory

declare namespace Desmos {
    interface GraphingCalculatorOptions {
      expressions?: boolean;
      settingsMenu?: boolean;
      zoomButtons?: boolean;
      expressionsTopbar?: boolean;
      lockViewport?: boolean;
      administerSecretFolders?: boolean;
      images?: boolean;
      folders?: boolean;
      notes?: boolean;
      sliders?: boolean;
      points?: boolean;
      branding?: boolean;
      border?: boolean;
      links?: boolean;
      trace?: boolean;
      keypad?: boolean;
      graphpaper?: boolean;
      actions?: boolean;
      create3DGraphs?: boolean;
    }
  
    interface ExpressionObject {
      id: string;
      latex?: string;
      color?: string;
      hidden?: boolean;
      secret?: boolean;
      folderId?: string;
      points?: boolean;
      lines?: boolean;
      dragMode?: string;
      label?: string;
      showLabel?: boolean;
    }
  
    interface ScreenshotOptions {
      width?: number;
      height?: number;
      targetPixelRatio?: number;
      preserveAxisNumbers?: boolean;
    }
  
    interface GraphingCalculator {
      setExpression(expr: ExpressionObject): void;
      getExpressions(): ExpressionObject[];
      removeExpression(id: string): void;
      setMathBounds(bounds: {
        left: number;
        right: number;
        bottom: number;
        top: number;
      }): void;
      screenshot(options: ScreenshotOptions, callback: (dataUrl: string) => void): void;
      destroy(): void;
      resize(): void;
    }
  
    function GraphingCalculator(
      element: HTMLElement,
      options?: GraphingCalculatorOptions
    ): GraphingCalculator;
  }
  
  interface Window {
    Desmos: typeof Desmos;
  }