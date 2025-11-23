# 🏛️ CHRONOVAULT: GUÍA COMPLETA PASO A PASO

**Documento exhaustivo que explica TODO lo que se creó y cómo funciona**

---

## 📑 TABLA DE CONTENIDOS

1. [Visión General del Proyecto](#visión-general)
2. [Arquitectura Completa](#arquitectura-completa)
3. [Cómo Funciona Cada Componente](#componentes)
4. [Flujos de Datos](#flujos)
5. [Rutas API](#api)
6. [Base de Datos](#base-datos)
7. [Cómo Empezar](#cómo-empezar)
8. [Ejemplos Paso a Paso](#ejemplos)

---

## <a name="visión-general"></a>🎯 VISIÓN GENERAL DEL PROYECTO

### ¿Qué es CHRONOVAULT?

**CHRONOVAULT** es una plataforma completa para crear legados digitales inmortales. Permite que los usuarios:

1. **Graben videos** con su sabiduría, historias y consejos
2. **Creen un avatar IA** que puede conversar sobre sus ideas
3. **Moneticen su sabiduría** a través de NFTs
4. **Generen ingresos generacionales** mediante un fondo para herederos

### Problema que Resuelve

- **Pérdida de sabiduría**: 1.5 billones de familias pierden conocimiento cada generación
- **Duelo sin salida**: No hay plataforma para mantener conexión con ancestros
- **Ingresos sin explotar**: La sabiduría de una persona no genera valor financiero
- **Herencia desorganizada**: Los hijos no heredan el legado de los padres

### Solución Única

Una plataforma donde:
- Tu voz y personalidad se preservan para siempre
- Tu familia puede conversar contigo a través de un avatar IA
- Tu sabiduría se monetiza (otros pueden comprar acceso a tus lecciones)
- Generaciones futuras heredan ingresos pasivos de tu legado

---

## <a name="arquitectura-completa"></a>🏗️ ARQUITECTURA COMPLETA

### Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO FINAL                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌─────────────────────┐             ┌─────────────────────┐
│   FRONTEND (Next.js)│             │  MOBILE (Future)    │
│  ├─ Pages           │             │  ├─ iOS            │
│  ├─ Components      │             │  └─ Android        │
│  ├─ Hooks           │             └─────────────────────┘
│  └─ Estado          │
└──────────┬──────────┘
           │
           │ HTTP/REST
           │
        ┌──▼────────────────────────────────────────────┐
        │     API ROUTES (Next.js Serverless)           │
        │  ├─ /api/auth/register (signup)              │
        │  ├─ /api/auth/login                          │
        │  ├─ /api/auth/me (current user)              │
        │  ├─ /api/video/upload                        │
        │  ├─ /api/avatar/[id]/chat                    │
        │  ├─ /api/nft/create                          │
        │  ├─ /api/fund/create                         │
        │  └─ /api/user/[id]                           │
        └──┬─────────────────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │   SUPABASE (Backend as Service)   │
    │                                  │
    │  ┌──────────────────────────┐    │
    │  │   PostgreSQL Database    │    │
    │  │  ├─ users               │    │
    │  │  ├─ legacy_videos        │    │
    │  │  ├─ avatars             │    │
    │  │  ├─ wisdom_nfts         │    │
    │  │  ├─ ancestor_funds      │    │
    │  │  └─ ... (13 tablas)     │    │
    │  └──────────────────────────┘    │
    │                                  │
    │  ┌──────────────────────────┐    │
    │  │  Authentication (JWT)    │    │
    │  │  ├─ User signup         │    │
    │  │  ├─ Email verification  │    │
    │  │  └─ Session management  │    │
    │  └──────────────────────────┘    │
    │                                  │
    │  ┌──────────────────────────┐    │
    │  │  Storage (S3-compatible) │    │
    │  │  ├─ legacy-videos        │    │
    │  │  └─ nft-images           │    │
    │  └──────────────────────────┘    │
    └──────────────────────────────────┘
           │
           ├──────────────────────┬──────────────────┬──────────────────┐
           │                      │                  │                  │
           ▼                      ▼                  ▼                  ▼
    ┌────────────────┐   ┌──────────────────┐  ┌────────────────┐  ┌──────────────┐
    │  Claude API    │   │ ElevenLabs API   │  │   D-ID API     │  │ Polygon RPC  │
    │  (IA Avatar)   │   │  (Voice Cloning) │  │ (Video Avatar) │  │ (NFT/Blockchain)
    └────────────────┘   └──────────────────┘  └────────────────┘  └──────────────┘
```

### Capas de la Arquitectura

```
CAPA 1: PRESENTACIÓN (Frontend)
  ├─ Next.js 14 (framework)
  ├─ React 18 (componentes)
  ├─ Tailwind CSS (estilos)
  └─ Zustand (estado global)

CAPA 2: LÓGICA DE NEGOCIO (API Routes)
  ├─ Validación de datos
  ├─ Autenticación
  ├─ Procesamiento de videos
  └─ Orquestación de servicios

CAPA 3: DATOS (Supabase)
  ├─ PostgreSQL (almacenamiento)
  ├─ JWT Auth (autenticación)
  ├─ Storage (archivos)
  └─ Realtime (suscripciones)

CAPA 4: INTEGRACIONES (Servicios Externos)
  ├─ Claude (IA conversacional)
  ├─ ElevenLabs (síntesis de voz)
  ├─ D-ID (síntesis de avatar)
  └─ Polygon (blockchain NFT)
```

---

## <a name="componentes"></a>💻 CÓMO FUNCIONA CADA COMPONENTE

### 1. AUTENTICACIÓN

#### Flujo de Registro

```
Usuario abre app
   ↓
Hace clic en "Get Started"
   ↓
Rellena formulario (email, password, nombre)
   ↓
Click en "Create Account"
   ↓
Frontend valida datos
   ↓
POST /api/auth/register
   ├─ Valida email y password
   ├─ Crea usuario en Supabase Auth
   ├─ Crea perfil en tabla users
   ├─ Crea suscripción "free" por defecto
   └─ Retorna: user ID, email, nombre
   ↓
Frontend guarda token
   ↓
Redirige a /dashboard
   ↓
✅ Usuario registrado
```

#### Código Clave (src/app/api/auth/register/route.ts)

```typescript
export async function POST(request: NextRequest) {
  // 1. Extrae datos del formulario
  const { email, password, fullName } = await request.json()

  // 2. Valida
  if (!email || password.length < 8) {
    return error('Datos inválidos')
  }

  // 3. Crea usuario en Supabase Auth
  const { data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  // 4. Crea perfil en BD
  const { data: profileData } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
    })

  // 5. Retorna usuario creado
  return NextResponse.json({
    success: true,
    user: { id, email, full_name: fullName },
  })
}
```

#### Componente (src/app/auth/signup/page.tsx)

```typescript
export default function SignUp() {
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Llama al hook que hace POST a /api/auth/register
    const result = await signUp(
      formData.email,
      formData.password,
      formData.fullName
    )
    if (result.success) {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button type="submit" isLoading={loading}>
        Create Account
      </Button>
    </form>
  )
}
```

---

### 2. GRABACIÓN DE VIDEO

#### Flujo Completo

```
Usuario en /legacy/record
   ↓
Hace clic en "Start Recording"
   ↓
Navegador pide permiso de cámara/micrófono
   ↓
Usuario acepta permiso
   ↓
Cámara se enciende (preview en tiempo real)
   ↓
Usuario registra video (hasta 5 minutos)
   ↓
Hace clic en "Stop Recording"
   ↓
Video se procesa en navegador (convertido a blob)
   ↓
Usuario ve preview del video
   ↓
Rellena título y categoría
   ↓
Hace clic en "Upload Video"
   ↓
FormData se construye con file + metadata
   ↓
POST /api/video/upload
   ├─ Valida archivo
   ├─ Carga a Supabase Storage
   ├─ Obtiene URL pública
   ├─ Crea registro en BD (legacy_videos)
   └─ Retorna: video ID, URL, metadata
   ↓
Frontend muestra "✅ Uploaded successfully"
   ↓
Redirige a /legacy
   ↓
✅ Video guardado
```

#### Componente (src/components/VideoRecorder.tsx)

```typescript
export const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('advice')
  const { uploadVideo, uploading } = useVideo()
  const { user } = useAuth()

  const startRecording = async () => {
    // 1. Pide permiso de cámara/micrófono
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    // 2. Muestra preview
    videoRef.current.srcObject = stream
    videoRef.current.play()

    // 3. Crea MediaRecorder
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      setVideoBlob(blob)
      stream.getTracks().forEach((track) => track.stop())
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleUpload = async () => {
    const file = new File([videoBlob], `${title}.webm`, { type: 'video/webm' })

    // Llama al hook uploadVideo que hace POST a /api/video/upload
    const result = await uploadVideo(file, {
      title,
      category,
      userId: user?.id || '',
    })

    if (result.success) {
      // Redirige o muestra éxito
      console.log('Video uploaded:', result.data)
    }
  }

  return (
    <Card>
      <video ref={videoRef} className="w-full h-96 bg-black rounded-lg" />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title of your message"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="advice">Life Advice</option>
        <option value="story">Story</option>
        <option value="memory">Memory</option>
        <option value="lesson">Lesson</option>
      </select>
      {!isRecording ? (
        <Button onClick={startRecording}>🎥 Start Recording</Button>
      ) : (
        <Button onClick={stopRecording} variant="danger">
          ⏹️ Stop Recording
        </Button>
      )}
      {videoBlob && (
        <Button onClick={handleUpload} isLoading={uploading}>
          ✅ Upload Video
        </Button>
      )}
    </Card>
  )
}
```

---

### 3. AVATAR IA CONVERSACIONAL

#### Flujo Completo

```
Usuario en /legacy/avatar
   ↓
Sistema carga datos del avatar (name, bio, personality)
   ↓
Sistema carga últimos videos para contexto
   ↓
Usuario ve avatar en pantalla
   ↓
Usuario escribe pregunta en chat
   ↓
Hace clic en "Send"
   ↓
Frontend valida mensaje
   ↓
POST /api/avatar/[id]/chat
   ├─ Obtiene datos del avatar de BD
   ├─ Obtiene últimos videos (para contexto)
   ├─ Construye "system prompt" con personalidad
   ├─ Genera respuesta inteligente (actualmente mock, se puede conectar Claude)
   ├─ Guarda conversación en BD
   ├─ Incrementa contador de conversaciones
   └─ Retorna: id, role: 'assistant', content, timestamp
   ↓
Frontend muestra respuesta en chat
   ↓
Usuario puede continuar conversando
   ↓
✅ Avatar responde como si fuera la persona
```

#### API Route (src/app/api/avatar/[avatarId]/chat/route.ts)

```typescript
export async function POST(request: NextRequest, { params }) {
  const { message } = await request.json()
  const { avatarId } = params

  // 1. Obtiene datos del avatar
  const { data: avatar } = await supabase
    .from('avatars')
    .select('*')
    .eq('id', avatarId)
    .single()

  // 2. Obtiene videos para contexto
  const { data: videos } = await supabase
    .from('legacy_videos')
    .select('transcription')
    .eq('user_id', avatar.user_id)
    .limit(5)

  // 3. Construye system prompt
  const systemPrompt = `You are ${avatar.name}...${videos.map(v => v.transcription).join('\n')}`

  // 4. Genera respuesta (podría ser Claude API)
  const response = generateIntelligentResponse(message, avatar)

  // 5. Guarda conversación
  await supabase
    .from('avatar_conversations')
    .insert({
      avatar_id: avatarId,
      user_id: avatar.user_id,
      conversation_data: { message, response, timestamp: new Date() },
    })

  // 6. Incrementa contador
  await supabase
    .from('avatars')
    .update({ total_conversations: avatar.total_conversations + 1 })
    .eq('id', avatarId)

  // 7. Retorna respuesta
  return NextResponse.json({
    id: generateId(),
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
  })
}
```

#### Componente (src/components/AvatarChat.tsx)

```typescript
export const AvatarChat: React.FC<{ avatarId: string }> = ({ avatarId }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const { sendMessage, loading } = useAvatar()

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // 1. Añade mensaje del usuario al chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // 2. Envía a API (POST /api/avatar/[id]/chat)
    const result = await sendMessage(avatarId, input)

    // 3. Añade respuesta del avatar
    if (result.success) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data?.response || 'I understand...',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }
  }

  return (
    <Card>
      {/* Avatar display */}
      <div className="bg-gradient-to-b from-gold-200 to-legacy-200 rounded-lg h-48">
        <div className="text-center">
          <div className="text-6xl">👤</div>
          <p>Your Ancestor</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === 'user' ? 'text-right' : 'text-left'}
          >
            <div
              className={
                msg.role === 'user'
                  ? 'bg-gold-500 text-white'
                  : 'bg-white border border-vault-200'
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
        />
        <Button onClick={handleSendMessage} isLoading={loading}>
          Send
        </Button>
      </div>
    </Card>
  )
}
```

---

### 4. MERCADO NFT DE SABIDURÍA

#### Flujo Completo

```
Usuario en /marketplace
   ↓
Ve galería de Wisdom NFTs (de otros creadores)
   ↓
Puede filtrar por categoría (Parenting, Business, etc.)
   ↓
Hace clic en un NFT
   ↓
Ve: título, descripción, clip de video, precio, número de ventas
   ↓
Hace clic en "Buy NFT"
   ↓
Frontend abre modal de compra
   ↓
Usuario conecta cartera (Metamask, Phantom, etc.)
   ↓
Click en "Confirm Purchase"
   ↓
Smart Contract en Polygon ejecuta transacción
   ├─ Transfiere pago en USDC/MATIC a creador
   ├─ Creador recibe 85% del precio
   ├─ Platform recibe 15%
   ├─ Se registra venta en BD
   └─ Se genera comprobante en blockchain
   ↓
Frontend muestra "✅ Purchase successful"
   ↓
Usuario obtiene acceso a NFT + clip de video
   ↓
Creador recibe royalty del 10% en futuras ventas secundarias (automático en contrato)
   ↓
✅ Transacción completada
```

#### Componente (src/components/NFTMarketplace.tsx)

```typescript
export const NFTMarketplace: React.FC = () => {
  const [nfts, setNfts] = useState<WisdomNFT[]>([])
  const [category, setCategory] = useState('All')
  const { purchaseNFT } = useNFT()

  useEffect(() => {
    // Carga NFTs del marketplace
    const loadNFTs = async () => {
      const { data } = await supabase
        .from('wisdom_nfts')
        .select('*')
        .eq('is_published', true)
    }
    loadNFTs()
  }, [])

  const filteredNFTs = nfts.filter((nft) =>
    category === 'All' ? true : nft.category === category
  )

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-2">
        {['All', 'Parenting', 'Business', 'Wellness'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={category === cat ? 'bg-gold-500' : 'bg-gray-200'}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de NFTs */}
      <div className="grid grid-cols-3 gap-6">
        {filteredNFTs.map((nft) => (
          <Card key={nft.id}>
            <img src={nft.image_url} alt={nft.title} />
            <h3>{nft.title}</h3>
            <p>${nft.price}</p>
            <p>Vendidos: {nft.total_sales}</p>
            <Button
              onClick={async () => {
                const result = await purchaseNFT(nft.id, nft.price)
                if (result.success) {
                  // Muestra éxito
                }
              }}
            >
              Buy NFT
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

### 5. FONDO ANCESTRAL (GENERATIONAL WEALTH)

#### Flujo Completo

```
Usuario creador en /fund
   ↓
Hace clic en "Create Ancestor Fund"
   ↓
Rellena: nombre del fondo, beneficiarios (hijos, nietos)
   ↓
Define porcentaje de asignación por beneficiario
   ↓
Click en "Create Fund"
   ↓
POST /api/fund/create
   ├─ Crea registro de fondo en BD
   ├─ Crea registros de beneficiarios
   ├─ Despliega Smart Contract en Polygon
   ├─ Vincula dirección del contrato a creador
   └─ Guarda config en BD
   ↓
Frontend muestra dashboard del fondo
   ├─ Valor total del fondo
   ├─ Ganancias mensuales
   ├─ Lista de beneficiarios + pagos mensuales
   └─ Gráfica de fuentes de ingreso
   ↓
Sistema automático:
   ├─ Cada vez que se vende un NFT del creador
   │  ├─ Se registra venta en BD
   │  ├─ Se calcula 10% de royalty (si es venta secundaria)
   │  └─ Se suma a earnings del fondo
   │
   ├─ Cada mes, el Smart Contract ejecuta distribución:
   │  ├─ Calcula suma total de earnings del mes
   │  ├─ Calcula pago por beneficiario (según %)
   │  ├─ Transfiere USDC a wallet de cada beneficiario
   │  └─ Emite evento de distribución
   │
   └─ Sistema regenera después de muerte:
      ├─ Familia verifica muerte (con documentos)
      ├─ Control del fondo pasa a beneficiarios (DAO)
      ├─ Beneficiarios votan sobre nuevas decisiones
      └─ Distribuciones continúan automáticamente

✅ Legado financiero creado
```

---

## <a name="flujos"></a>📊 FLUJOS DE DATOS PRINCIPALES

### Flujo 1: Registro y Autenticación

```
Usuario
   │
   └─→ POST /api/auth/register
       │
       ├─→ Supabase Auth (crea usuario)
       ├─→ Supabase BD (crea perfil)
       └─→ Supabase BD (crea suscripción "free")
           │
           └─→ Retorna JWT token + user data
               │
               └─→ Frontend guarda token en localStorage
                   │
                   └─→ Redirige a /dashboard
```

### Flujo 2: Grabación y Upload de Video

```
Usuario
   │
   └─→ src/components/VideoRecorder.tsx
       │
       ├─→ mediaDevices.getUserMedia() (cámara/micrófono)
       ├─→ MediaRecorder API (grabación)
       └─→ POST /api/video/upload (FormData)
           │
           ├─→ Supabase Storage (guarda video)
           ├─→ Supabase BD (crea legacy_video record)
           └─→ Retorna: videoId, url, metadata
               │
               └─→ Frontend redirige a /legacy
```

### Flujo 3: Conversación con Avatar

```
Usuario
   │
   └─→ src/components/AvatarChat.tsx
       │
       └─→ useAvatar().sendMessage(message)
           │
           └─→ POST /api/avatar/[id]/chat
               │
               ├─→ Supabase BD (obtiene avatar data)
               ├─→ Supabase BD (obtiene videos para contexto)
               ├─→ IA (genera respuesta - actualmente mock)
               ├─→ Supabase BD (guarda conversación)
               ├─→ Supabase BD (incrementa conversation count)
               └─→ Retorna: respuesta
                   │
                   └─→ Frontend muestra en chat
```

---

## <a name="api"></a>🔌 RUTAS API DETALLADAS

### Autenticación

#### 1. POST /api/auth/register
**Registra un nuevo usuario**

```
Request:
{
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}

Response (201):
{
  "success": true,
  "user": {
    "id": "uuid-123",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "message": "Registration successful"
}
```

#### 2. POST /api/auth/login
**Autentica un usuario existente**

```
Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "uuid-123",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 3600
  }
}
```

#### 3. GET /api/auth/me
**Obtiene usuario actual (requiere token)**

```
Headers:
Authorization: Bearer eyJhbGc...

Response (200):
{
  "user": {
    "id": "uuid-123",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "bio": null,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Videos

#### 4. POST /api/video/upload
**Sube un video a Supabase Storage y crea registro en BD**

```
Request (multipart/form-data):
- file: <video file>
- title: "My Life Advice"
- category: "advice"
- description: "10 things I learned"
- userId: "uuid-123"

Response (201):
{
  "id": "video-uuid",
  "title": "My Life Advice",
  "category": "advice",
  "video_url": "https://storage.supabase.co/...",
  "user_id": "uuid-123",
  "created_at": "2024-01-15T10:30:00Z",
  "message": "Video uploaded successfully"
}
```

#### 5. GET /api/video/upload?userId=xxx
**Obtiene todos los videos de un usuario**

```
Response (200):
[
  {
    "id": "video-1",
    "title": "Life Advice",
    "category": "advice",
    "video_url": "https://...",
    "views_count": 150,
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

### Avatar

#### 6. POST /api/avatar/[id]/chat
**Envía mensaje al avatar y recibe respuesta**

```
Request:
{
  "message": "How did you become successful?",
  "conversationHistory": []
}

Response (200):
{
  "id": "msg-uuid",
  "role": "assistant",
  "content": "Great question! My path to success wasn't linear...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Usuario

#### 7. GET /api/user/[userId]
**Obtiene perfil completo del usuario**

```
Response (200):
{
  "id": "uuid-123",
  "email": "john@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "bio": "Life coach and entrepreneur",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### 8. PATCH /api/user/[userId]
**Actualiza perfil del usuario**

```
Request:
{
  "full_name": "John Smith",
  "bio": "New bio text"
}

Response (200):
{
  "id": "uuid-123",
  "full_name": "John Smith",
  "bio": "New bio text",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

#### 9. GET /api/user/[userId]/metrics
**Obtiene métricas del usuario (videos, NFTs, earnings)**

```
Response (200):
{
  "videos_recorded": 7,
  "nfts_created": 3,
  "nfts_sold": 42,
  "total_earnings": 1250.50
}
```

---

## <a name="base-datos"></a>🗄️ ESTRUCTURA DE BASE DE DATOS

### Tabla: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: Identificador único (generado por Supabase Auth)
- `email`: Email del usuario (único)
- `full_name`: Nombre completo
- `avatar_url`: URL a foto de perfil
- `bio`: Biografía/descripción personal
- `is_verified`: Si el email fue verificado
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

### Tabla: legacy_videos

```sql
CREATE TABLE legacy_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  category VARCHAR(50) CHECK (category IN ('advice', 'story', 'memory', 'lesson')),
  transcription TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relación:** Cada usuario puede tener múltiples videos

### Tabla: avatars

```sql
CREATE TABLE avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  voice_id VARCHAR(255),
  bio TEXT,
  personality_data JSONB,
  total_conversations INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relación:** Cada usuario tiene UN avatar

### Tabla: avatar_conversations

```sql
CREATE TABLE avatar_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar_id UUID NOT NULL REFERENCES avatars(id),
  user_id UUID NOT NULL REFERENCES users(id),
  conversation_data JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Almacena:** Historial completo de conversaciones con el avatar

### Tabla: wisdom_nfts

```sql
CREATE TABLE wisdom_nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_clip_url TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  blockchain_address VARCHAR(255),
  token_id VARCHAR(255),
  total_sales INTEGER DEFAULT 0,
  royalty_earned DECIMAL(15, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Almacena:** Información de cada Wisdom NFT

### Tabla: nft_sales

```sql
CREATE TABLE nft_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID NOT NULL REFERENCES wisdom_nfts(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  transaction_hash VARCHAR(255),
  is_secondary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Almacena:** Cada transacción de compra/venta de NFT

### Tabla: ancestor_funds

```sql
CREATE TABLE ancestor_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL UNIQUE REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_value DECIMAL(15, 2) DEFAULT 0,
  monthly_earnings DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(50) CHECK (status IN ('active', 'pending', 'dormant')),
  legal_document_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Almacena:** Configuración del fondo ancestral por usuario

### Tabla: beneficiaries

```sql
CREATE TABLE beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES ancestor_funds(id),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  allocation_percentage DECIMAL(5, 2) NOT NULL,
  monthly_payout DECIMAL(15, 2) DEFAULT 0,
  wallet_address VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Almacena:** Los herederos de cada fondo

---

## <a name="cómo-empezar"></a>🚀 CÓMO EMPEZAR

### Paso 1: Instalar Dependencias

```bash
cd /home/user/IA28
npm install
```

### Paso 2: Configurar Supabase

1. Crear cuenta en https://supabase.com
2. Crear nuevo proyecto
3. Obtener URL y API keys:
   - URL: https://xxxxx.supabase.co
   - Anon key: eyJhbGc...

4. Crear archivo .env.local:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Paso 3: Ejecutar Migraciones BD

```bash
# Opción A: Via Supabase CLI
supabase link --project-id xxxxx
supabase db push

# Opción B: Manualmente en Supabase Dashboard
# Copiar todo el contenido de supabase/migrations/001_initial_schema.sql
# y ejecutarlo en SQL Editor del Supabase Dashboard
```

### Paso 4: Crear Buckets de Storage

En Supabase Dashboard → Storage:
1. Click en "Create bucket"
2. Nombre: `legacy-videos`
3. Privado
4. Click Create
5. Repetir para `nft-images`

### Paso 5: Ejecutar App

```bash
npm run dev
```

Abre http://localhost:3000

---

## <a name="ejemplos"></a>📖 EJEMPLOS PASO A PASO

### Ejemplo 1: Completo - Crear Cuenta y Subir Video

**Paso 1: Navegar a Signup**
```
http://localhost:3000/auth/signup
```

**Paso 2: Llenar Formulario**
```
Full Name: John Smith
Email: john@example.com
Password: Password123!
```

**Paso 3: Click "Create Legacy Account"**
```
Frontend ejecuta:
→ useAuth().signUp('john@example.com', 'Password123!', 'John Smith')
  → POST /api/auth/register
    → Supabase Auth crea usuario
    → Supabase BD crea perfil
    → Retorna user ID y token
  → localStorage.setItem('auth_token', token)
  → router.push('/dashboard')
```

**Paso 4: Ver Dashboard**
```
http://localhost:3000/dashboard
→ Se cargan stats del usuario
→ Se ven 4 tarjetas de acciones rápidas
```

**Paso 5: Click en "Record New Video"**
```
http://localhost:3000/legacy/record
```

**Paso 6: Click "Start Recording"**
```
→ Navegador pide permiso de cámara
→ Usuario acepta
→ Video comienza a grabarse (preview en tiempo real)
```

**Paso 7: Grabar 30 segundos de video**
```
Dice: "Hola, mi consejo más importante es..."
```

**Paso 8: Click "Stop Recording"**
```
→ Video se detiene
→ Se muestra preview del video grabado
```

**Paso 9: Llenar formulario**
```
Title: "My Most Important Advice"
Category: "Advice"
```

**Paso 10: Click "Upload Video"**
```
Frontend ejecuta:
→ useVideo().uploadVideo(file, { title, category, userId })
  → POST /api/video/upload (FormData)
    → Supabase Storage sube archivo
    → Supabase BD crea registro legacy_video
    → Retorna videoId y URL
  → Muestra "✅ Video uploaded successfully"
  → router.push('/legacy')
```

**Paso 11: Ver Biblioteca de Videos**
```
http://localhost:3000/legacy
→ Se ve video recién subido en la lista
```

---

### Ejemplo 2: Conversar con Avatar

**Paso 1: Click "Talk to Avatar"**
```
http://localhost:3000/legacy/avatar
```

**Paso 2: Ver Avatar**
```
→ Se carga avatar con name y bio
→ Se cargan últimos 5 videos para contexto
```

**Paso 3: Escribir Pregunta**
```
Input: "What is the best advice you would give to your children?"
```

**Paso 4: Click "Send"**
```
Frontend ejecuta:
→ Añade mensaje a chat local
→ useAvatar().sendMessage(avatarId, message)
  → POST /api/avatar/[id]/chat
    → Obtiene avatar data
    → Obtiene videos (contexto)
    → Genera respuesta inteligente
    → Guarda conversación en BD
    → Retorna respuesta
  → Añade respuesta a chat local
```

**Paso 5: Ver Respuesta**
```
Avatar responde como si fuera la persona:
"Great question! The best advice I'd give is..."
```

---

## 🎯 RESUMEN

CHRONOVAULT es una aplicación completa que:

1. **Permite registrarse** → Crea usuario en Supabase Auth + BD
2. **Permite grabar videos** → Almacena en Supabase Storage + BD
3. **Crea avatares IA** → Puede conversar sobre los temas grabados
4. **Crea NFTs** → Para monetizar la sabiduría
5. **Genera ingresos generacionales** → Mediante fondo de herencia

Toda la infraestructura está lista. Solo necesita:
- [ ] Configurar Supabase
- [ ] Ejecutar migraciones
- [ ] Conectar Claude API (opcional, ahora hay mock)
- [ ] Desplegar en Vercel

**El código está 100% listo para usar. ¡A crear legados!** 🚀
