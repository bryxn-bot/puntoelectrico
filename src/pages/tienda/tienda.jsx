import Head from '../../components/head';
import './tienda.css';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ImageOff,
    MapPin,
    Menu,
    MessageCircle,
    Search,
    ShoppingCart,
    SlidersHorizontal,
    Star,
    Wrench,
    X,
} from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { clientes, marcasAliadas } from '../../data/aliados';
import { ambientes, productos } from '../../data/productos';
const WHATSAPP = '51935428871';
const NOTA_PRECIOS = 'Precios en soles, sujetos a confirmación de stock.';
const soles = (m) => `S/ ${m.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const POR_PAGINA = 12;
const categorias = Array.from(new Set(productos.map((p) => p.categoria)));
const marcas = Array.from(new Set(productos.map((p) => p.marca)));
const wa = (t) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const menu = [
    { texto: 'Inicio', href: '/' },
    { texto: 'Tienda', href: '/tienda' },
    { texto: 'Acerca de nosotros', href: '/brochure/g-services-brochure.pdf' },
    { texto: 'Contacto', href: '/#contacto' },
];
/* ---------- Piezas pequeñas ---------- */
function LogoAliado({ aliado, className = '' }) {
    const [fallo, setFallo] = useState(false);
    if (fallo) return <span className={`logo-aliado__texto ${className}`}>{aliado.nombre}</span>;
    return (
        <img
            src={aliado.logo}
            alt={aliado.nombre}
            loading="lazy"
            onError={() => setFallo(true)}
            className={`logo-aliado__img ${className}`}
        />
    );
}
function CintaLogos({ aliados }) {
    return (
        <div className="cinta">
            <div className="cinta__pista">
                {[...aliados, ...aliados].map((a, i) => (
                    <div key={i} aria-hidden={i >= aliados.length} className="cinta__logo">
                        <LogoAliado aliado={a} className="ocupa-todo" />
                    </div>
                ))}
            </div>
        </div>
    );
}
function ImagenProducto({ src, alt, className = '', estilo }) {
    const [fallo, setFallo] = useState(false);
    useEffect(() => setFallo(false), [src]);
    if (!src || fallo)
        return (
            <div className={`imagen-vacia ${className}`}>
                <ImageOff className="icono-32" />
                <span className="imagen-vacia__texto">Imagen próximamente</span>
            </div>
        );
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFallo(true)}
            style={estilo}
            className={`imagen-producto ${className}`}
        />
    );
}
const estiloEstado = {
    Disponible: 'insignia--disponible',
    'Pocas unidades': 'insignia--pocas',
    Agotado: 'insignia--agotado',
    Consultar: 'insignia--consultar',
};
function InsigniaEstado({ estado }) {
    return (
        <span className={`insignia ${estiloEstado[estado]}`}>
            <span className="insignia__punto" />
            {estado === 'Consultar' ? 'Consultar stock' : estado}
        </span>
    );
}
function Estrellas({ valor, resenas, grande = false }) {
    if (!valor || !resenas) return null;
    const tam = grande ? 'estrella--grande' : 'estrella--chica';
    return (
        <div className="estrellas" aria-label={`${valor.toFixed(1)} de 5 estrellas, ${resenas} opiniones`}>
            <div className="estrellas__fila" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`estrella ${tam}`}>
                        <Star className={`estrella__fondo ${tam}`} />
                        <span
                            className="estrella__recorte"
                            style={{ width: `${Math.max(0, Math.min(1, valor - (n - 1))) * 100}%` }}
                        >
                            <Star className={`estrella__relleno ${tam}`} />
                        </span>
                    </span>
                ))}
            </div>
            <span className={`estrellas__nota ${grande ? 'texto-sm' : 'texto-xs'}`}>{valor.toFixed(1)}</span>
            <span className={`estrellas__cantidad ${grande ? 'texto-sm' : 'texto-xs'}`}>({resenas})</span>
        </div>
    );
}
const banners = [
    {
        imagen: '/banners/banner-1.jpg',
        alt: 'Iluminación LED',
        accion: { categorias: ['Focos LED', 'Cintas LED', 'Candelabros LED', 'Plafones y apliques'] },
    },
    {
        imagen: '/banners/banner-2.jpg',
        alt: 'Protección eléctrica',
        accion: { categorias: ['Tableros eléctricos', 'Interruptores termomagnéticos'] },
    },
    {
        imagen: '/banners/banner-3.jpg',
        alt: 'Accesorios para tu instalación',
        accion: { categorias: ['Interruptores y tomacorrientes', 'Cajas de paso', 'Sockets', 'Accesorios'] },
    },
];
function BannerPromocional({ onAccion }) {
    const [actual, setActual] = useState(0);
    const [pausado, setPausado] = useState(false);
    const total = banners.length;
    useEffect(() => {
        if (pausado || total < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = window.setInterval(() => setActual((i) => (i + 1) % total), 5500);
        return () => window.clearInterval(id);
    }, [pausado, total]);
    const ir = (paso) => setActual((i) => (i + paso + total) % total);
    const inicio = useRef(null);
    const alTocar = (e) => {
        inicio.current = e.touches[0].clientX;
        setPausado(true);
    };
    const alSoltar = (e) => {
        if (inicio.current === null) return;
        const d = e.changedTouches[0].clientX - inicio.current;
        if (Math.abs(d) > 40) ir(d < 0 ? 1 : -1);
        inicio.current = null;
        setPausado(false);
    };
    if (total === 0) return null;
    return (
        <section
            className="banner"
            aria-roledescription="carrusel"
            aria-label="Promociones"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onTouchStart={alTocar}
            onTouchEnd={alSoltar}
        >
            <div className="banner__marco">
                <div className="banner__pista" style={{ transform: `translateX(-${actual * 100}%)` }}>
                    {banners.map((b, i) => (
                        <button
                            key={b.imagen}
                            type="button"
                            onClick={() => onAccion(b)}
                            tabIndex={i === actual ? 0 : -1}
                            aria-hidden={i !== actual}
                            aria-label={b.alt}
                            className="banner__slide"
                        >
                            <img src={b.imagen} alt="" aria-hidden="true" className="banner__fondo" />
                            <picture>
                                {b.imagenCelular && <source media="(max-width: 639px)" srcSet={b.imagenCelular} />}
                                <img src={b.imagen} alt={b.alt} className="banner__imagen" />
                            </picture>
                        </button>
                    ))}
                </div>
                {total > 1 && (
                    <>
                        {[-1, 1].map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => ir(d)}
                                className={`banner__flecha ${d < 0 ? 'banner__flecha--izq' : 'banner__flecha--der'}`}
                                aria-label={d < 0 ? 'Promoción anterior' : 'Promoción siguiente'}
                            >
                                {d < 0 ? <ChevronLeft className="icono-20" /> : <ChevronRight className="icono-20" />}
                            </button>
                        ))}
                        <div className="puntos">
                            {banners.map((b, i) => (
                                <button
                                    key={b.imagen}
                                    type="button"
                                    onClick={() => setActual(i)}
                                    className={`banner__punto ${i === actual ? 'banner__punto--activo' : 'banner__punto--inactivo'}`}
                                    aria-label={`Ver promoción ${i + 1}`}
                                    aria-current={i === actual}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
/* ---------- Tarjeta de servicio (después del 6.º producto) ---------- */
function TarjetaServicio() {
    const [sinFoto, setSinFoto] = useState(false);
    return (
        <article className="servicio">
            {sinFoto ? (
                <div className="servicio__fondo" aria-hidden="true">
                    <div className="servicio__cinta" />
                    <Wrench className="servicio__llave" />
                </div>
            ) : (
                <>
                    <img
                        src="/img/servicio-instalacion.jpg"
                        alt=""
                        loading="lazy"
                        onError={() => setSinFoto(true)}
                        className="servicio__foto"
                    />
                    <div className="servicio__degradado" />
                </>
            )}
            <div className="servicio__contenido">
                <p className="servicio__empresa">G-Services, servicio técnico</p>
                <h3 className="servicio__titulo">
                    <span className="servicio__titulo-amarillo">Instalación</span>
                    <span className="servicio__titulo-linea">profesional</span>
                </h3>
                <div className="servicio__datos">
                    <span className="servicio__dato">
                        <MapPin className="servicio__icono" /> Lima
                    </span>
                    <span className="servicio__dato">
                        <Wrench className="servicio__icono" /> Mantenimiento preventivo
                    </span>
                </div>
                <a
                    href={wa('Hola, quisiera cotizar un servicio de instalación o mantenimiento.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="servicio__boton"
                >
                    <MessageCircle className="icono-20" /> Cotizar servicio
                </a>
                <a href="/nosotros" target="_blank" rel="noopener noreferrer" className="servicio__enlace">
                    Conoce G-Services
                </a>
            </div>
        </article>
    );
}
/* ---------- Carrusel de imágenes (con lupa opcional) ---------- */
function Carrusel({ imagenes, nombre, altura, miniaturas = false, lupa = false }) {
    const [actual, setActual] = useState(0);
    const [origen, setOrigen] = useState(null);
    const varias = imagenes.length > 1;
    const moverLupa = (e) => {
        if (!lupa) return;
        const r = e.currentTarget.getBoundingClientRect();
        setOrigen(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const mover = (e, paso) => {
        e.stopPropagation();
        setActual((i) => (i + paso + imagenes.length) % imagenes.length);
    };
    return (
        <div>
            <div className={`carrusel__marco ${altura}`}>
                <div
                    className={`carrusel__zona ${lupa ? 'carrusel__zona--lupa' : ''}`}
                    onMouseMove={moverLupa}
                    onMouseLeave={() => setOrigen(null)}
                >
                    <ImagenProducto
                        src={imagenes[actual]}
                        alt={`${nombre} - imagen ${actual + 1}`}
                        className={`carrusel__imagen ${lupa ? (origen ? 'carrusel__imagen--zoom' : 'carrusel__imagen--reposo') : 'carrusel__imagen--hover'}`}
                        estilo={lupa && origen ? { transformOrigin: origen } : undefined}
                    />
                </div>
                {varias && (
                    <>
                        {[-1, 1].map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={(e) => mover(e, d)}
                                className={`carrusel__flecha ${d < 0 ? 'carrusel__flecha--izq' : 'carrusel__flecha--der'}`}
                                aria-label={d < 0 ? 'Imagen anterior' : 'Imagen siguiente'}
                            >
                                {d < 0 ? <ChevronLeft className="icono-20" /> : <ChevronRight className="icono-20" />}
                            </button>
                        ))}
                        {!miniaturas && (
                            <div className="puntos">
                                {imagenes.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`carrusel__punto ${i === actual ? 'carrusel__punto--activo' : 'carrusel__punto--inactivo'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            {miniaturas && varias && (
                <div className="carrusel__miniaturas">
                    {imagenes.map((img, i) => (
                        <button
                            key={img}
                            type="button"
                            onClick={() => setActual(i)}
                            className={`carrusel__miniatura ${i === actual ? 'carrusel__miniatura--activa' : 'carrusel__miniatura--inactiva'}`}
                            aria-label={`Ver imagen ${i + 1}`}
                        >
                            <img src={img} alt="" className="carrusel__miniatura-img" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
export default function Tienda() {
    /* ---------- FILTROS ---------- */
    const [busqueda, setBusqueda] = useState('');
    const [categoriasSel, setCategoriasSel] = useState([]);
    const [marcasSel, setMarcasSel] = useState([]);
    const [ambientesSel, setAmbientesSel] = useState([]);
    const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
    const [orden, setOrden] = useState('destacados');
    const [visibles, setVisibles] = useState(POR_PAGINA);
    const [soloDisponibles, setSoloDisponibles] = useState(false);
    const alternar = (lista, v) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);
    const limpiarFiltros = () => {
        setBusqueda('');
        setCategoriasSel([]);
        setMarcasSel([]);
        setAmbientesSel([]);
        setSoloDisponibles(false);
        window.history.replaceState(null, '', '/tienda');
    };
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ambiente = params.get('ambiente');
        if (ambiente && ambientes.includes(ambiente)) setAmbientesSel([ambiente]);
        const buscar = params.get('buscar');
        if (buscar) setBusqueda(buscar);
    }, []);
    const ambienteRecomendado = ambientesSel.length === 1 ? ambientesSel[0] : null;
    const resultados = useMemo(() => {
        const t = busqueda.trim().toLowerCase();
        const lista = productos.filter(
            (p) =>
                (t === '' ||
                    p.nombre.toLowerCase().includes(t) ||
                    p.marca.toLowerCase().includes(t) ||
                    p.codigo.toLowerCase().includes(t) ||
                    p.categoria.toLowerCase().includes(t)) &&
                (categoriasSel.length === 0 || categoriasSel.includes(p.categoria)) &&
                (marcasSel.length === 0 || marcasSel.includes(p.marca)) &&
                (!soloDisponibles || p.estado === 'Disponible' || p.estado === 'Pocas unidades') &&
                (ambientesSel.length === 0 || p.ambientes.some((a) => ambientesSel.includes(a))),
        );
        if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
        if (orden === 'calificacion') lista.sort((a, b) => (b.calificacion ?? 0) - (a.calificacion ?? 0));
        if (orden === 'precio-menor') lista.sort((a, b) => a.precio - b.precio);
        if (orden === 'precio-mayor') lista.sort((a, b) => b.precio - a.precio);
        if (orden === 'nuevos') lista.sort((a, b) => b.id - a.id);
        if (orden === 'destacados')
            lista.sort((a, b) => Number(!!b.masVendido) - Number(!!a.masVendido) || Number(!!b.nuevo) - Number(!!a.nuevo));
        return lista;
    }, [busqueda, categoriasSel, marcasSel, ambientesSel, orden, soloDisponibles]);
    useEffect(() => {
        setVisibles(POR_PAGINA);
    }, [busqueda, categoriasSel, marcasSel, ambientesSel, orden, soloDisponibles]);
    const mostrados = resultados.slice(0, visibles);
    const filtrosActivos = [
        ...(busqueda.trim() ? [{ etiqueta: `"${busqueda.trim()}"`, quitar: () => setBusqueda('') }] : []),
        ...ambientesSel.map((a) => ({ etiqueta: a, quitar: () => setAmbientesSel((l) => l.filter((v) => v !== a)) })),
        ...categoriasSel.map((c) => ({ etiqueta: c, quitar: () => setCategoriasSel((l) => l.filter((v) => v !== c)) })),
        ...marcasSel.map((m) => ({ etiqueta: m, quitar: () => setMarcasSel((l) => l.filter((v) => v !== m)) })),
        ...(soloDisponibles ? [{ etiqueta: 'Solo disponibles', quitar: () => setSoloDisponibles(false) }] : []),
    ];
    /* ---------- CARRITO ---------- */
    const [carrito, setCarrito] = useState({});
    const [carritoCargado, setCarritoCargado] = useState(false);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [nombreCliente, setNombreCliente] = useState('');
    useEffect(() => {
        try {
            const g = localStorage.getItem('carrito-punto-electric-v2');
            if (g) setCarrito(JSON.parse(g));
        } catch {
            /* carrito vacío */
        }
        setCarritoCargado(true);
    }, []);
    useEffect(() => {
        if (!carritoCargado) return;
        try {
            localStorage.setItem('carrito-punto-electric-v2', JSON.stringify(carrito));
        } catch {
            /* sin almacenamiento */
        }
    }, [carrito, carritoCargado]);
    const cambiarCantidad = (id, cantidad) =>
        setCarrito((actual) => {
            const nuevo = { ...actual };
            if (cantidad <= 0) delete nuevo[id];
            else nuevo[id] = cantidad;
            return nuevo;
        });
    const itemsCarrito = productos.filter((p) => carrito[p.id]).map((p) => ({ ...p, cantidad: carrito[p.id] }));
    const totalUnidades = itemsCarrito.reduce((s, i) => s + i.cantidad, 0);
    const totalSoles = itemsCarrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const enviarPorWhatsApp = () => {
        const lista = itemsCarrito
            .map(
                (i, n) =>
                    `${n + 1}. [${i.codigo}] ${i.nombre} (${i.marca})\n   ${i.cantidad} x ${soles(i.precio)} = ${soles(i.precio * i.cantidad)}`,
            )
            .join('\n');
        const mensaje =
            `Hola Punto Electric, quisiera hacer el siguiente pedido:\n\n${lista}\n\n` +
            `Total de unidades: ${totalUnidades}\nTotal estimado: ${soles(totalSoles)}` +
            (nombreCliente.trim() ? `\nNombre: ${nombreCliente.trim()}` : '');
        window.open(wa(mensaje), '_blank', 'noopener,noreferrer');
    };
    /* ---------- DETALLE ---------- */
    const [productoSel, setProductoSel] = useState(null);
    const [cantidadDetalle, setCantidadDetalle] = useState(1);
    const [agregado, setAgregado] = useState(false);
    const abrirDetalle = (p) => {
        setProductoSel(p);
        setCantidadDetalle(1);
        setAgregado(false);
    };
    const relacionados = productoSel
        ? productos
              .filter((p) => p.id !== productoSel.id)
              .map((p) => ({
                  p,
                  puntos:
                      (p.categoria === productoSel.categoria ? 2 : 0) +
                      p.ambientes.filter((a) => productoSel.ambientes.includes(a)).length,
              }))
              .filter((r) => r.puntos > 0)
              .sort((a, b) => b.puntos - a.puntos)
              .slice(0, 4)
              .map((r) => r.p)
        : [];
    const agregarDesdeDetalle = () => {
        if (!productoSel) return;
        cambiarCantidad(productoSel.id, (carrito[productoSel.id] ?? 0) + cantidadDetalle);
        setAgregado(true);
    };
    /* ---------- MENÚ ---------- */
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [compacto, setCompacto] = useState(false);
    const catalogoRef = useRef(null);
    useEffect(() => {
        const f = () => setCompacto(window.scrollY > 40);
        f();
        window.addEventListener('scroll', f, { passive: true });
        return () => window.removeEventListener('scroll', f);
    }, []);
    useEffect(() => {
        document.body.style.overflow = menuAbierto || carritoAbierto || productoSel ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuAbierto, carritoAbierto, productoSel]);
    useEffect(() => {
        const cerrar = (e) => {
            if (e.key === 'Escape') {
                setProductoSel(null);
                setCarritoAbierto(false);
                setMenuAbierto(false);
            }
        };
        window.addEventListener('keydown', cerrar);
        return () => window.removeEventListener('keydown', cerrar);
    }, []);
    const irAlCatalogo = () => catalogoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const aplicarBanner = (b) => {
        setBusqueda(b.accion.buscar ?? '');
        setCategoriasSel(b.accion.categorias ?? []);
        setAmbientesSel(b.accion.ambiente ? [b.accion.ambiente] : []);
        setMarcasSel([]);
        irAlCatalogo();
    };
    const esNosotros = (href) => href.endsWith('.pdf');
    return (
        <>
            <Head title="Tienda | Punto Electric" />

            <div className="tienda">
                <div className="barra-descuento">Aprovecha un 10 % de descuento en tu primera compra</div>

                {/* MENÚ */}
                <header className={`cabecera ${compacto ? 'cabecera--compacta' : 'cabecera--normal'}`}>
                    <div
                        className={`cabecera__contenido ${compacto ? 'cabecera__contenido--compacto' : 'cabecera__contenido--normal'}`}
                    >
                        <a href="/" className="cabecera__marca">
                            <img
                                src="/img/logoelectrico.jpg"
                                alt="Logo Punto Electric"
                                className={`cabecera__logo ${compacto ? 'cabecera__logo--compacto' : 'cabecera__logo--normal'}`}
                            />
                            <div>
                                <p className="cabecera__nombre">
                                    PUNTO <span className="texto-amarillo">ELECTRIC</span>
                                </p>
                                <p className="cabecera__lema">Soluciones eléctricas</p>
                            </div>
                        </a>

                        <nav className="cabecera__menu">
                            {menu.map((item) => (
                                <a
                                    key={item.texto}
                                    href={item.href}
                                    target={esNosotros(item.href) ? '_blank' : undefined}
                                    rel={esNosotros(item.href) ? 'noopener noreferrer' : undefined}
                                    aria-current={item.href === '/tienda' ? 'page' : undefined}
                                    className={`menu-enlace ${item.href === '/tienda' ? 'menu-enlace--activo' : 'menu-enlace--normal'}`}
                                >
                                    {item.texto}
                                </a>
                            ))}
                        </nav>

                        <div className="cabecera__acciones">
                            <button
                                type="button"
                                onClick={() => setCarritoAbierto(true)}
                                className="boton-carrito"
                                aria-label={`Abrir carrito, ${totalUnidades} productos`}
                            >
                                <ShoppingCart className="icono-20" />
                                <span className="boton-carrito__texto">Carrito</span>
                                {totalUnidades > 0 && <span className="boton-carrito__contador">{totalUnidades}</span>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setMenuAbierto(true)}
                                className="boton-menu"
                                aria-label="Abrir menú"
                                aria-expanded={menuAbierto}
                            >
                                <Menu className="icono-20" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* MENÚ CELULAR */}
                <div
                    className={`menu-movil ${menuAbierto ? 'menu-movil--abierto' : 'menu-movil--cerrado'}`}
                    role="dialog"
                    aria-label="Menú"
                    aria-hidden={!menuAbierto}
                >
                    <div className="menu-movil__cabecera">
                        <p className="titulo-md">
                            PUNTO <span className="texto-amarillo">ELECTRIC</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setMenuAbierto(false)}
                            className="menu-movil__cerrar"
                            aria-label="Cerrar menú"
                        >
                            <X className="icono-24" />
                        </button>
                    </div>
                    <nav className="menu-movil__lista">
                        {menu.map((item, i) => (
                            <a
                                key={item.texto}
                                href={item.href}
                                target={esNosotros(item.href) ? '_blank' : undefined}
                                rel={esNosotros(item.href) ? 'noopener noreferrer' : undefined}
                                onClick={() => setMenuAbierto(false)}
                                style={{ transitionDelay: menuAbierto ? `${80 + i * 50}ms` : '0ms' }}
                                className={`menu-movil__enlace ${menuAbierto ? 'menu-movil__enlace--visible' : 'menu-movil__enlace--oculto'} ${item.href === '/tienda' ? 'menu-movil__enlace--activo' : ''}`}
                            >
                                {item.texto}
                                <ArrowRight className="menu-movil__flecha" />
                            </a>
                        ))}
                    </nav>
                    <div className="menu-movil__pie">
                        <a
                            href={wa('Hola, vengo de la tienda web.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="menu-movil__whatsapp"
                        >
                            <MessageCircle className="icono-20" /> Escríbenos por WhatsApp
                        </a>
                    </div>
                </div>

                <main>
                    <BannerPromocional onAccion={aplicarBanner} />

                    {marcasAliadas.length > 0 && (
                        <section className="marcas">
                            <p className="marcas__titulo">Marcas que distribuimos</p>
                            <CintaLogos aliados={marcasAliadas} />
                        </section>
                    )}

                    <section className="catalogo">
                        <div ref={catalogoRef} className="catalogo__ancla" />

                        {/* Título + buscador */}
                        <div className="catalogo__encabezado">
                            <div>
                                <h1 className="catalogo__titulo">
                                    Catálogo <span className="texto-amarillo">Punto Electric</span>
                                </h1>
                                <p className="texto-secundario">
                                    {resultados.length}{' '}
                                    {resultados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                                </p>
                            </div>
                            <div className="buscador">
                                <Search className="buscador__icono" />
                                <input
                                    id="buscar"
                                    type="search"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Busca por nombre, marca o código"
                                    aria-label="Buscar producto"
                                    className="buscador__input"
                                />
                            </div>
                        </div>

                        {/* Categorías en fila deslizable */}
                        <div className="categorias">
                            <button
                                type="button"
                                onClick={() => setCategoriasSel([])}
                                className={`categoria ${categoriasSel.length === 0 ? 'categoria--activa' : 'categoria--inactiva'}`}
                            >
                                Todo
                            </button>
                            {categorias.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCategoriasSel((l) => alternar(l, c))}
                                    aria-pressed={categoriasSel.includes(c)}
                                    className={`categoria ${categoriasSel.includes(c) ? 'categoria--activa' : 'categoria--inactiva'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                            aria-expanded={filtrosAbiertos}
                            className="boton-filtros"
                        >
                            <SlidersHorizontal className="icono-16" />
                            {filtrosAbiertos ? 'Ocultar filtros' : 'Más filtros'}
                        </button>

                        <div className="catalogo__cuerpo">
                            {/* FILTROS */}
                            <aside className={`filtros ${filtrosAbiertos ? 'filtros--abiertos' : 'filtros--cerrados'}`}>
                                <h2 className="titulo-md">Filtros</h2>

                                <fieldset className="filtros__grupo">
                                    <legend className="filtros__titulo">Ambiente</legend>
                                    <div className="filtros__lista">
                                        {ambientes.map((a) => (
                                            <label key={a} className="filtros__opcion">
                                                <input
                                                    type="checkbox"
                                                    checked={ambientesSel.includes(a)}
                                                    onChange={() => setAmbientesSel((l) => alternar(l, a))}
                                                    className="filtros__check"
                                                />
                                                <span className="filtros__nombre">{a}</span>
                                                <span className="texto-tenue-xs">
                                                    {productos.filter((p) => p.ambientes.includes(a)).length}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <fieldset className="filtros__grupo--marcas">
                                    <legend className="filtros__titulo">Marca</legend>
                                    <div className="filtros__lista--marcas">
                                        {marcas.map((m) => (
                                            <label key={m} className="filtros__opcion">
                                                <input
                                                    type="checkbox"
                                                    checked={marcasSel.includes(m)}
                                                    onChange={() => setMarcasSel((l) => alternar(l, m))}
                                                    className="filtros__check"
                                                />
                                                <span>{m}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <label className="filtros__solo-disponibles">
                                    <input
                                        type="checkbox"
                                        checked={soloDisponibles}
                                        onChange={(e) => setSoloDisponibles(e.target.checked)}
                                        className="filtros__check"
                                    />
                                    Solo disponibles
                                </label>

                                <button type="button" onClick={limpiarFiltros} className="filtros__limpiar">
                                    Limpiar filtros
                                </button>
                            </aside>

                            {/* PRODUCTOS */}
                            <div>
                                {ambienteRecomendado && (
                                    <div className="recomendado">
                                        <div>
                                            <p className="recomendado__titulo">
                                                Recomendados para {ambienteRecomendado.toLowerCase()}
                                            </p>
                                            <p className="texto-secundario">
                                                {ambienteRecomendado === 'Exteriores' &&
                                                    'Productos para jardines, fachadas, cocheras y zonas expuestas a la intemperie.'}
                                                {ambienteRecomendado === 'Interiores' &&
                                                    'Productos para salas, dormitorios, cocinas y ambientes dentro de casa.'}
                                                {ambienteRecomendado === 'Comercial' &&
                                                    'Productos para tiendas, oficinas, almacenes y locales comerciales.'}
                                            </p>
                                        </div>
                                        <button type="button" onClick={limpiarFiltros} className="recomendado__boton">
                                            Ver todo el catálogo
                                        </button>
                                    </div>
                                )}

                                <div className="resultados__barra">
                                    <div className="resultados__etiquetas">
                                        {filtrosActivos.map((f) => (
                                            <button
                                                key={f.etiqueta}
                                                type="button"
                                                onClick={f.quitar}
                                                className="etiqueta-filtro"
                                                aria-label={`Quitar filtro ${f.etiqueta}`}
                                            >
                                                {f.etiqueta} <span aria-hidden="true">×</span>
                                            </button>
                                        ))}
                                        {filtrosActivos.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={limpiarFiltros}
                                                className="etiqueta-filtro__quitar-todos"
                                            >
                                                Quitar todos
                                            </button>
                                        )}
                                    </div>
                                    <label className="orden">
                                        <span className="orden__texto">Ordenar</span>
                                        <select
                                            value={orden}
                                            onChange={(e) => setOrden(e.target.value)}
                                            className="orden__select"
                                        >
                                            <option value="destacados">Destacados</option>
                                            <option value="nuevos">Más recientes</option>
                                            <option value="precio-menor">Precio: menor a mayor</option>
                                            <option value="precio-mayor">Precio: mayor a menor</option>
                                            <option value="calificacion">Mejor calificados</option>
                                            <option value="nombre">Nombre A-Z</option>
                                        </select>
                                    </label>
                                </div>

                                {resultados.length === 0 ? (
                                    <div className="vacio">
                                        <p className="texto-negrita">Ningún producto coincide con los filtros.</p>
                                        <button type="button" onClick={limpiarFiltros} className="vacio__boton">
                                            Limpiar filtros
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grilla">
                                        {mostrados.map((p, indice) => (
                                            <Fragment key={p.id}>
                                                <article onClick={() => abrirDetalle(p)} className="tarjeta">
                                                    {(p.nuevo || p.masVendido) && (
                                                        <div className="tarjeta__etiquetas">
                                                            {p.masVendido && (
                                                                <span className="etiqueta-mas-vendido">Más vendido</span>
                                                            )}
                                                            {p.nuevo && <span className="etiqueta-nuevo">Nuevo</span>}
                                                        </div>
                                                    )}
                                                    <Carrusel
                                                        imagenes={p.imagenes}
                                                        nombre={p.nombre}
                                                        altura="carrusel__marco--tarjeta"
                                                    />

                                                    <div className="tarjeta__cuerpo">
                                                        <div className="tarjeta__fila">
                                                            <p className="tarjeta__marca">{p.marca}</p>
                                                            <p className="tarjeta__codigo">{p.codigo}</p>
                                                        </div>
                                                        <h3 className="tarjeta__nombre">{p.nombre}</h3>
                                                        <div className="tarjeta__estrellas">
                                                            <Estrellas valor={p.calificacion} resenas={p.resenas} />
                                                        </div>
                                                        <div className="tarjeta__precio-fila">
                                                            <p className="tarjeta__precio">{soles(p.precio)}</p>
                                                            <InsigniaEstado estado={p.estado} />
                                                        </div>
                                                        <div className="tarjeta__acciones">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    abrirDetalle(p);
                                                                }}
                                                                className="tarjeta__boton"
                                                            >
                                                                Ver producto
                                                            </button>
                                                            {carrito[p.id] && (
                                                                <span className="tarjeta__en-carrito">
                                                                    ✓ {carrito[p.id]} en carrito
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                                {indice === 5 && <TarjetaServicio />}
                                            </Fragment>
                                        ))}
                                    </div>
                                )}

                                {resultados.length > mostrados.length && (
                                    <div className="mas">
                                        <p className="mas__texto">
                                            Mostrando {mostrados.length} de {resultados.length} productos
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setVisibles((v) => v + POR_PAGINA)}
                                            className="mas__boton"
                                        >
                                            Cargar más productos
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {clientes.length > 0 && (
                        <section className="clientes">
                            <div className="clientes__contenedor">
                                <div className="clientes__encabezado">
                                    <p className="etiqueta-amarilla">Confían en nosotros</p>
                                    <h2 className="clientes__titulo">Empresas que hemos asesorado</h2>
                                </div>
                                <div className="clientes__grilla">
                                    {clientes.map((c) => (
                                        <div key={c.nombre} className="clientes__logo">
                                            <LogoAliado aliado={c} className="ocupa-todo" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                {/* BOTÓN FLOTANTE DEL CARRITO */}
                {totalUnidades > 0 && !carritoAbierto && !productoSel && (
                    <button type="button" onClick={() => setCarritoAbierto(true)} className="carrito-flotante">
                        Ver carrito ({totalUnidades}) · {soles(totalSoles)}
                    </button>
                )}

                {/* DETALLE DEL PRODUCTO */}
                {productoSel && (
                    <div className="detalle">
                        <div className="detalle__fondo" onClick={() => setProductoSel(null)} aria-hidden="true" />
                        <div role="dialog" aria-label={productoSel.nombre} className="detalle__ventana">
                            <button
                                type="button"
                                onClick={() => setProductoSel(null)}
                                className="detalle__cerrar"
                                aria-label="Cerrar"
                            >
                                ×
                            </button>

                            <div className="detalle__cuerpo">
                                <Carrusel
                                    key={productoSel.id}
                                    imagenes={productoSel.imagenes}
                                    nombre={productoSel.nombre}
                                    altura="carrusel__marco--detalle"
                                    miniaturas
                                    lupa
                                />

                                <div className="detalle__info">
                                    <p className="etiqueta-amarilla">
                                        {productoSel.categoria} | {productoSel.marca} | Cód. {productoSel.codigo}
                                    </p>
                                    <h2 className="detalle__titulo">{productoSel.nombre}</h2>
                                    <div className="detalle__estrellas">
                                        <Estrellas valor={productoSel.calificacion} resenas={productoSel.resenas} grande />
                                    </div>
                                    <p className="detalle__descripcion">{productoSel.descripcion}</p>

                                    <div className="detalle__precio-fila">
                                        <p className="detalle__precio">{soles(productoSel.precio)}</p>
                                        <InsigniaEstado estado={productoSel.estado} />
                                    </div>
                                    <p className="detalle__nota">Precio por unidad. {NOTA_PRECIOS}</p>

                                    {productoSel.estado === 'Agotado' && (
                                        <p className="detalle__agotado">
                                            Este producto está agotado por ahora. Agrégalo a tu pedido y te avisamos la fecha de
                                            reposición.
                                        </p>
                                    )}

                                    <div className="detalle__compra">
                                        <p className="detalle__etiqueta">Cantidad</p>
                                        <div className="detalle__cantidad-fila">
                                            <div className="cantidad">
                                                <button
                                                    type="button"
                                                    onClick={() => setCantidadDetalle((c) => Math.max(1, c - 1))}
                                                    className="cantidad__boton"
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    −
                                                </button>
                                                <span className="cantidad__valor">{cantidadDetalle}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setCantidadDetalle((c) => c + 1)}
                                                    className="cantidad__boton"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="texto-gris-sm">
                                                Subtotal:{' '}
                                                <span className="detalle__subtotal-valor">
                                                    {soles(productoSel.precio * cantidadDetalle)}
                                                </span>
                                            </p>
                                        </div>

                                        <button type="button" onClick={agregarDesdeDetalle} className="detalle__agregar">
                                            Agregar al carrito
                                        </button>

                                        {agregado && (
                                            <div className="detalle__agregado">
                                                <p className="detalle__agregado-texto">
                                                    ✓ Agregado. Tienes {carrito[productoSel.id] ?? 0} en tu carrito.
                                                </p>
                                                <div className="detalle__agregado-botones">
                                                    <button
                                                        type="button"
                                                        onClick={() => setProductoSel(null)}
                                                        className="detalle__seguir"
                                                    >
                                                        Seguir comprando
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProductoSel(null);
                                                            setCarritoAbierto(true);
                                                        }}
                                                        className="detalle__ver-carrito"
                                                    >
                                                        Ver carrito
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {relacionados.length > 0 && (
                                <div className="relacionados">
                                    <h3 className="titulo-md">También te puede interesar</h3>
                                    <div className="relacionados__grilla">
                                        {relacionados.map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => abrirDetalle(r)}
                                                className="relacionados__item"
                                            >
                                                <ImagenProducto
                                                    src={r.imagenes[0]}
                                                    alt={r.nombre}
                                                    className="relacionados__imagen"
                                                />
                                                <p className="relacionados__nombre">{r.nombre}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PANEL DEL CARRITO */}
                {carritoAbierto && (
                    <div className="carrito">
                        <div className="carrito__fondo" onClick={() => setCarritoAbierto(false)} aria-hidden="true" />
                        <aside role="dialog" aria-label="Carrito de compras" className="carrito__panel">
                            <div className="carrito__cabecera">
                                <h2 className="titulo-xl">Tu carrito</h2>
                                <button
                                    type="button"
                                    onClick={() => setCarritoAbierto(false)}
                                    className="carrito__cerrar"
                                    aria-label="Cerrar carrito"
                                >
                                    ×
                                </button>
                            </div>

                            {itemsCarrito.length === 0 ? (
                                <div className="carrito__vacio">
                                    <p className="texto-negrita">Tu carrito está vacío.</p>
                                    <p className="carrito__vacio-texto">Agrega productos del catálogo para armar tu pedido.</p>
                                    <button
                                        type="button"
                                        onClick={() => setCarritoAbierto(false)}
                                        className="carrito__vacio-boton"
                                    >
                                        Ver productos
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <ul className="carrito__lista">
                                        {itemsCarrito.map((i) => (
                                            <li key={i.id} className="carrito__item">
                                                <ImagenProducto src={i.imagenes[0]} alt="" className="carrito__imagen" />
                                                <div className="carrito__datos">
                                                    <p className="carrito__nombre-prod">{i.nombre}</p>
                                                    <p className="texto-tenue-xs">
                                                        {i.marca} · {i.codigo}
                                                    </p>
                                                    <p className="carrito__precios">
                                                        <span className="carrito__precio-unit">{soles(i.precio)} c/u · </span>
                                                        <span className="texto-negrita">{soles(i.precio * i.cantidad)}</span>
                                                    </p>
                                                    <div className="detalle__cantidad-fila">
                                                        <div className="carrito__cantidad">
                                                            <button
                                                                type="button"
                                                                onClick={() => cambiarCantidad(i.id, i.cantidad - 1)}
                                                                className="carrito__cantidad-boton"
                                                                aria-label="Quitar uno"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="carrito__cantidad-valor">{i.cantidad}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => cambiarCantidad(i.id, i.cantidad + 1)}
                                                                className="carrito__cantidad-boton"
                                                                aria-label="Agregar uno"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => cambiarCantidad(i.id, 0)}
                                                            className="carrito__eliminar"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="carrito__resumen">
                                        <label htmlFor="nombre" className="detalle__etiqueta">
                                            Tu nombre (opcional)
                                        </label>
                                        <input
                                            id="nombre"
                                            type="text"
                                            value={nombreCliente}
                                            onChange={(e) => setNombreCliente(e.target.value)}
                                            placeholder="Ej. Juan Pérez"
                                            className="carrito__nombre-cliente"
                                        />

                                        <div className="carrito__total">
                                            <p className="texto-gris-sm">
                                                Total estimado · {totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'}
                                            </p>
                                            <p className="carrito__total-valor">{soles(totalSoles)}</p>
                                        </div>
                                        <p className="carrito__nota">{NOTA_PRECIOS} Te confirmamos el pedido por WhatsApp.</p>

                                        <button type="button" onClick={enviarPorWhatsApp} className="carrito__whatsapp">
                                            Enviar pedido por WhatsApp
                                        </button>
                                        <button type="button" onClick={() => setCarrito({})} className="carrito__vaciar">
                                            Vaciar carrito
                                        </button>
                                    </div>
                                </>
                            )}
                        </aside>
                    </div>
                )}

                {/* PIE DE PÁGINA */}
                <footer id="contacto" className="pie">
                    <div className="pie__grilla">
                        <div>
                            <div className="fila-gap-3">
                                <div className="pie__logo-circulo">
                                    <img src="/img/logoelectrico.jpg" alt="Logo Punto Electric" className="pie__logo-img" />
                                </div>
                                <h2 className="titulo-xl">
                                    PUNTO <span className="texto-amarillo">ELECTRIC</span>
                                </h2>
                            </div>
                            <p className="pie__redes-titulo">Síguenos en nuestras redes sociales</p>
                            <div className="fila-gap-3">
                                {[
                                    {
                                        href: 'https://www.facebook.com/share/18QVLnsBty/',
                                        img: '/img/redes/facebook.png',
                                        nombre: 'Facebook',
                                    },
                                    {
                                        href: 'https://www.tiktok.com/@punto_electric',
                                        img: '/img/redes/titok.png',
                                        nombre: 'TikTok',
                                    },
                                    { href: `https://wa.me/${WHATSAPP}`, img: '/img/redes/whatsapp.png', nombre: 'WhatsApp' },
                                ].map((r) => (
                                    <a
                                        key={r.nombre}
                                        href={r.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visitar ${r.nombre}`}
                                        className="pie__red"
                                    >
                                        <img src={r.img} alt={r.nombre} className="pie__red-img" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="pie__titulo-col">Información</h3>
                            <div className="pie__lista">
                                <a href="/inicio" className="pie__enlace">
                                    Inicio
                                </a>
                                <a href="/brochure/g-services-brochure.pdf" rel="noopener noreferrer" className="pie__enlace">
                                    Acerca de nosotros
                                </a>
                                <p>Preguntas frecuentes</p>
                                <p>Política de privacidad</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="pie__titulo-col">Contáctanos</h3>
                            <div className="pie__lista">
                                <p className="pie__correo">Correo: ventasgservices@gmail.com</p>
                                <p>Teléfono: +51 935 428 871</p>
                                <p>Lima, Perú</p>
                            </div>
                            <a
                                href={wa('Hola, deseo recibir información sobre sus productos')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pie__contactar"
                            >
                                Contactar con asesor
                            </a>
                        </div>
                    </div>
                    <div className="pie__legal">© 2026 Punto Electric. Todos los derechos reservados por el autor.</div>
                </footer>
            </div>
        </>
    );
}
