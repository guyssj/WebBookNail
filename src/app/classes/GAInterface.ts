export interface GtagPageview {
    page_title?: string;
    page_path?: string;
    page_location?: string;
    [key: string]: any;
  }
  
  export interface GtagConfig {
    trackingId: string;
    trackPageviews?: boolean;
    debug?: boolean;
  }