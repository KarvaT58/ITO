import { ContactsTab } from './_components/ContactsTab'

export default function ContactsPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Contatos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus contatos do WhatsApp
          </p>
        </div>
        
        <div className="px-6 pb-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Funcionalidades</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• Adicionar contatos</div>
              <div>• Importar CSV</div>
              <div>• Gerenciar etiquetas</div>
              <div>• Bloquear/desbloquear</div>
              <div>• Verificar WhatsApp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ContactsTab />
      </div>
    </div>
  )
}
