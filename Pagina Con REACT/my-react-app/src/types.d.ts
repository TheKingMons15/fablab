declare module 'html2pdf.js' {
  export default function html2pdf(options?: any, worker?: any): {
    set(option: any): any; // Ajusta el tipo según las opciones que uses
    from(element: HTMLElement): {
      set(option: any): any; // Permite encadenar set
      save(): void;
      // Agrega otros métodos como toPdf(), toImg(), etc., si los usas
    };
  };
}