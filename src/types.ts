export interface IndexRow {
  id: string;
  name: string;
  close: string;
  daily: string;
  weekly: string;
  monthly: string;
  ytd: string;
}

export interface StockChangeRow {
  id: string;
  symbol: string;
  close: string;
  change: string;
}

export interface VolumeRow {
  id: string;
  symbol1: string;
  close1: string;
  volume1: string;
  symbol2: string;
  close2: string;
  volume2: string;
}

export interface ImpactRow {
  id: string;
  symbol: string;
  point: string;
  change: string;
}

export interface BulletinData {
  header: {
    logoText: string;
    logoImageUrl?: string;
    title: string;
    date: string;
  };
  tipText: string;
  fontSizeLeft?: 'small' | 'normal' | 'large' | 'xlarge';
  fontBoldTitles?: boolean;
  neOldu: string[];
  neOlacak: string[];
  piyasaYorumu: string[];
  bistIndices: IndexRow[];
  worldIndices: IndexRow[];
  gainers: StockChangeRow[];
  losers: StockChangeRow[];
  volumes: VolumeRow[];
  positiveImpact: ImpactRow[];
  negativeImpact: ImpactRow[];
  footerNote: string;
  companyName: string;
}

export type EditorTab = 
  | 'genel'
  | 'haberler'
  | 'bist'
  | 'dunya'
  | 'yukselen_dusen'
  | 'hacim_etki'
  | 'ai_assistant';
