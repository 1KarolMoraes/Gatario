import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export default function FormatDate(date) {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};