// Oscar Saharoy 2022


export default `


#define t uTime
#define pi 3.14159265359
#define n normalize
#define failure vec3(-1)

uniform float uTime;
uniform vec2 uResolution;


float saturate( float x ) {

	return clamp( x, 0., 1. );
}

float hash( float x ) {

	return fract(sin(x) * 43758.5453123);
}


float wave( float x ) {

	// remap domain
	float rx = mod( x, 2.*pi );
	rx -= 2. * (rx-pi) * step(pi, rx);

	// coefficients from wave.c
	float m = 5.;
	float n = .2;
	float a = 0.947154;
	float b = -0.165649;
	float c = 8.876987;
	float k = -7.711339;

	// wave function
	return a*rx + b*exp(-m*rx) + c*exp(-n*rx) + k;
}

float dwave( float x ) {

	// remap domain
	float rx = mod( x, 2.*pi );
	float drxdx = 1. - step(pi, rx) * 2.;
	rx -= 2. * (rx-pi) * step(pi, rx);

	// coefficients from wave.c
	float m = 5.;
	float n = .2;
	float a = 0.947154;
	float b = -0.165649;
	float c = 8.876987;
	float k = -7.711339;

	// differential of wave function
	return 
		( a + -b*m*exp(-m*rx) + -c*n*exp(-n*rx) )
		* drxdx;
}


float waves( vec2 p ) {

	float r = 0.;

	float f = 1.;
	float a = .1;

	for( float i = 0.; i<4.; ++i ) {

		float o = hash(i) * 10.;
		vec2 d = n(vec2( hash(i+.1), hash(i+.2)*.2 ));
		float s = dot(d,p) * f + o - f*t;

		r += wave( s ) * a;

		float m = 1.05;

		f = f * m;
		a = a / m;
	}

	return r;
}

vec2 dwaves( vec2 p ) {

	vec2 dr = vec2(0);

	float f = 1.;
	float a = .1;

	// r = sum_i wave(s_i)

	for( float i = 0.; i<4.; ++i ) {

		float o = hash(i) * 10.;
		vec2 d = n(vec2( hash(i+.1), hash(i+.2)*.2 ));

		float s = dot(d,p) * f + o - f*t;

		// d(wavei + waves) = dwavei + dwaves

		dr += dwave(s) * a * f * d;

		float m = 1.05;

		f = f * m;
		a = a / m;
	}

	return dr;
}

vec3 intPlane( vec3 ro, vec3 rd, vec4 plane ) {

	float t = ( dot(ro, plane.xyz) - plane.w )
		/ -dot(rd, plane.xyz);

	if( t < 0. ) return failure;
	return ro + t * rd;
}

vec3 marchWaves( vec3 ro, vec3 rd ) {

	vec4 surfPlane = vec4(0,1,0,0);
	if( intPlane( ro, rd, surfPlane ) == failure )
		return failure;

	vec3 p = ro;

	for( float i = 0.; i<100.; ++i ) {

		float d = p.y - waves(p.xz);

		if( d < .01 ) return p;

		p += d*rd;
	}

	return p;
}

float moon( vec3 rd ) {
	
	float a = dot( rd, n(vec3(-.8,.1,0.)) );
	return .015/sqrt(1.-a) + .1*exp(-abs(rd.y)*10.) + hash(rd.y+hash(rd.z))*1e-2;
}

void mainImage(
		out vec4 fragColor, in vec2 fragCoord ) {

	vec3 light = vec3(0); 

	vec2 p = ( fragCoord - uResolution * .5 ) 
		/ min(uResolution.x, uResolution.y) * 2.;

	vec3 rd = n(vec3( p.x, p.y, -2. ));
	rd = rd.zyx;
	vec3 ro = vec3( 0., 1., 0. );

	vec3 wavesPos = marchWaves( ro, rd );

	if( wavesPos != failure ) {

		vec2 ddxddz = dwaves( wavesPos.xz );

		vec3 ddx = vec3( 1., ddxddz.x, 0. );
		vec3 ddz = vec3( 0., ddxddz.y, 1. );
		vec3 normal = n(cross( ddz, ddx ));

		vec3 refl = rd - 2.*normal * dot(rd,normal);
		light += moon(refl) * exp( -.02*length(wavesPos) );
	}
	else {

		light += moon(rd);
	}

	fragColor = vec4( light, 1. );
}


void main() {

    mainImage( gl_FragColor, gl_FragCoord.xy );
}

`;

